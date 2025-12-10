#!/usr/bin/env node

import { Client } from 'ssh2';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import { execSync } from 'child_process';

// Configuration
const SSH_CONFIG = {
  host: process.env.DEPLOY_HOST || 'cloud.cemorion.com',
  port: parseInt(process.env.DEPLOY_PORT || '333'),
  username: process.env.DEPLOY_USER || 'sirius',
};

const DEPLOY_PATH = process.env.DEPLOY_PATH || '/opt/teknoritma-site';
const PM2_APP_NAME = process.env.PM2_APP_NAME || 'teknoritma-site';
const PM2_PORT = process.env.PM2_PORT || '4000'; // Production port

// Log file
const LOG_DIR = path.join(process.cwd(), 'logs');
const LOG_FILE = path.join(LOG_DIR, `deploy-${new Date().toISOString().replace(/:/g, '-').split('.')[0]}.log`);

// Ensure logs directory exists
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

// Logger class
class Logger {
  private logFile: fs.WriteStream;

  constructor() {
    this.logFile = fs.createWriteStream(LOG_FILE, { flags: 'a' });
  }

  log(message: string, type: 'INFO' | 'SUCCESS' | 'ERROR' | 'WARN' | 'STEP' = 'INFO') {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${type}] ${message}`;
    
    console.log(logMessage);
    this.logFile.write(logMessage + '\n');
  }

  close() {
    this.logFile.end();
  }
}

const logger = new Logger();

// Check local git status before deployment
function checkLocalGitStatus(): boolean {
  try {
    logger.log('🔍 Checking local git status...', 'STEP');
    
    // Check if there are uncommitted changes
    try {
      const status = execSync('git status --porcelain', { encoding: 'utf8', stdio: 'pipe' });
      if (status.trim()) {
        logger.log('⚠️  Warning: You have uncommitted changes locally:', 'WARN');
        logger.log(status, 'WARN');
        logger.log('⚠️  These changes will NOT be deployed. Only pushed commits will be deployed.', 'WARN');
      }
    } catch (e) {
      // git status failed, might not be a git repo or git not installed
    }

    // Check if there are unpushed commits
    try {
      execSync('git fetch origin', { encoding: 'utf8', stdio: 'pipe' });
      const localCommit = execSync('git rev-parse HEAD', { encoding: 'utf8', stdio: 'pipe' }).trim();
      const remoteCommit = execSync('git rev-parse origin/main', { encoding: 'utf8', stdio: 'pipe' }).trim();
      
      if (localCommit !== remoteCommit) {
        const unpushed = execSync(`git log ${remoteCommit}..HEAD --oneline`, { encoding: 'utf8', stdio: 'pipe' });
        if (unpushed.trim()) {
          logger.log('⚠️  Warning: You have unpushed commits:', 'WARN');
          logger.log(unpushed, 'WARN');
          logger.log('⚠️  These commits will NOT be deployed. Push them first with: git push origin main', 'WARN');
          return false;
        }
      }
    } catch (e: any) {
      logger.log(`⚠️  Could not check unpushed commits: ${e.message}`, 'WARN');
    }

    logger.log('✅ Local git status OK', 'SUCCESS');
    return true;
  } catch (error: any) {
    logger.log(`⚠️  Could not check git status: ${error.message}`, 'WARN');
    return true; // Continue anyway
  }
}

// Execute command on remote server
async function execCommand(conn: Client, command: string): Promise<{ stdout: string; stderr: string; code: number | null }> {
  return new Promise((resolve, reject) => {
    conn.exec(command, (err, stream) => {
      if (err) {
        reject(err);
        return;
      }

      let stdout = '';
      let stderr = '';

      stream.on('close', (code, signal) => {
        resolve({ stdout, stderr, code });
      });

      stream.on('data', (data: Buffer) => {
        const text = data.toString();
        stdout += text;
        process.stdout.write(text);
      });

      stream.stderr.on('data', (data: Buffer) => {
        const text = data.toString();
        stderr += text;
        process.stderr.write(text);
      });
    });
  });
}

// Get password from user (masked input)
function getPassword(): Promise<string> {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    // Check if stdin is a TTY
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true);
    }

    let password = '';
    process.stdout.write('SSH Password: ');

    const onData = (char: Buffer) => {
      const str = char.toString('utf8');
      
      switch (str) {
        case '\n':
        case '\r':
        case '\u0004':
          if (process.stdin.isTTY) {
            process.stdin.setRawMode(false);
          }
          process.stdin.pause();
          process.stdin.removeListener('data', onData);
          process.stdout.write('\n');
          rl.close();
          resolve(password);
          break;
        case '\u0003':
          process.exit();
          break;
        case '\u007f': // backspace
        case '\b':
          if (password.length > 0) {
            password = password.slice(0, -1);
            process.stdout.write('\b \b');
          }
          break;
        default:
          password += str;
          process.stdout.write('*');
          break;
      }
    };

    process.stdin.on('data', onData);
    process.stdin.resume();
  });
}

// Main deployment function
async function deploy() {
  logger.log('🚀 Starting deployment process...', 'STEP');
  logger.log(`📍 Target: ${SSH_CONFIG.username}@${SSH_CONFIG.host}:${SSH_CONFIG.port}`, 'INFO');
  logger.log(`📂 Deploy path: ${DEPLOY_PATH}`, 'INFO');
  logger.log(`🔌 PM2 Port: ${PM2_PORT}`, 'INFO');
  logger.log(`📝 Log file: ${LOG_FILE}`, 'INFO');

  // Pre-deployment checks
  const gitStatusOk = checkLocalGitStatus();
  if (!gitStatusOk) {
    logger.log('⚠️  Continuing anyway, but unpushed commits will not be deployed.', 'WARN');
  }

  const password = await getPassword();
  logger.log('✅ Password received', 'SUCCESS');

  const conn = new Client();

  try {
    // Connect to server
    logger.log('🔌 Connecting to server...', 'STEP');
    await new Promise<void>((resolve, reject) => {
      conn.on('ready', () => {
        logger.log('✅ Connected successfully!', 'SUCCESS');
        resolve();
      });

      conn.on('error', (err) => {
        logger.log(`❌ Connection error: ${err.message}`, 'ERROR');
        reject(err);
      });

      conn.connect({
        ...SSH_CONFIG,
        password,
        readyTimeout: 30000,
      });
    });

    // Step 1: Git operations
    logger.log('📥 Step 1: Updating code from Git...', 'STEP');
    const gitCommands = [
      `cd ${DEPLOY_PATH}`,
      'echo "=== Git Operations ==="',
      'git fetch origin',
      'echo "Resetting to origin/main..."',
      'git reset --hard origin/main',
      'git clean -fd',
      'echo ""',
      'echo "Git status:"',
      'git status --short',
      'echo ""',
      'echo "Latest commit:"',
      'git log -1 --oneline',
    ];

    const gitResult = await execCommand(conn, gitCommands.join(' && '));
    if (gitResult.code !== 0) {
      throw new Error(`Git operations failed: ${gitResult.stderr}`);
    }
    logger.log('✅ Git update completed', 'SUCCESS');

    // Step 2: Check if node_modules exists, if not or outdated, install
    logger.log('📦 Step 2: Checking and installing dependencies...', 'STEP');
    const installCommand = `cd ${DEPLOY_PATH} && npm install --legacy-peer-deps`;
    const installResult = await execCommand(conn, installCommand);
    
    if (installResult.code !== 0) {
      logger.log(`⚠️  npm install warnings (code: ${installResult.code})`, 'WARN');
      logger.log(installResult.stderr, 'WARN');
    }
    logger.log('✅ Dependencies checked and installed', 'SUCCESS');

    // Step 3: Pre-build checks - verify critical files exist
    logger.log('🔍 Step 2.5: Pre-build validation...', 'STEP');
    const preBuildChecks = [
      `cd ${DEPLOY_PATH}`,
      'echo "Checking critical files..."',
      'test -f package.json && echo "✓ package.json exists" || echo "✗ package.json missing"',
      'test -f next.config.ts && echo "✓ next.config.ts exists" || test -f next.config.js && echo "✓ next.config.js exists" || echo "⚠ next.config not found"',
      'test -d app && echo "✓ app directory exists" || echo "✗ app directory missing"',
      'test -d components && echo "✓ components directory exists" || echo "✗ components directory missing"',
    ];
    
    const preBuildResult = await execCommand(conn, preBuildChecks.join(' && '));
    logger.log('Pre-build check results:', 'INFO');
    logger.log(preBuildResult.stdout, 'INFO');

    // Step 4: Build
    logger.log('🏗️  Step 3: Building application...', 'STEP');
    const buildResult = await execCommand(conn, `cd ${DEPLOY_PATH} && npm run build`);
    if (buildResult.code !== 0) {
      throw new Error(`Build failed: ${buildResult.stderr}`);
    }
    logger.log('✅ Build completed', 'SUCCESS');

    // Step 5: Verify build output
    logger.log('🔍 Step 3.5: Verifying build output...', 'STEP');
    const verifyBuild = await execCommand(conn, `cd ${DEPLOY_PATH} && test -d .next && echo "✓ Build output (.next) exists" || echo "✗ Build output missing"`);
    logger.log(verifyBuild.stdout, 'INFO');

    // Step 6: PM2 configuration and restart
    logger.log('🔄 Step 4: Configuring and restarting PM2...', 'STEP');
    
    // Check if PM2 process exists
    const checkPM2 = await execCommand(conn, `pm2 describe ${PM2_APP_NAME} 2>&1 || echo "NOT_FOUND"`);
    
    if (checkPM2.stdout.includes('NOT_FOUND') || checkPM2.code !== 0) {
      // PM2 process doesn't exist, start it
      logger.log('🚀 PM2 process not found, starting new process...', 'INFO');
      const startResult = await execCommand(conn, `cd ${DEPLOY_PATH} && PORT=${PM2_PORT} pm2 start npm --name "${PM2_APP_NAME}" -- start`);
      if (startResult.code !== 0) {
        throw new Error(`PM2 start failed: ${startResult.stderr}`);
      }
      logger.log('✅ PM2 process started', 'SUCCESS');
    } else {
      // PM2 process exists, restart it
      logger.log('🔄 Restarting existing PM2 process...', 'INFO');
      const restartResult = await execCommand(conn, `cd ${DEPLOY_PATH} && PORT=${PM2_PORT} pm2 restart ${PM2_APP_NAME} --update-env`);
      if (restartResult.code !== 0) {
        throw new Error(`PM2 restart failed: ${restartResult.stderr}`);
      }
      logger.log('✅ PM2 process restarted', 'SUCCESS');
    }

    // Step 7: Save PM2 configuration
    logger.log('💾 Saving PM2 configuration...', 'STEP');
    const savePM2 = await execCommand(conn, 'pm2 save');
    logger.log('✅ PM2 configuration saved', 'SUCCESS');

    // Step 8: Check status
    logger.log('📊 Step 5: Checking application status...', 'STEP');
    const statusResult = await execCommand(conn, `pm2 status ${PM2_APP_NAME}`);
    logger.log(statusResult.stdout, 'INFO');

    // Check if app is listening on correct port
    const portCheck = await execCommand(conn, `pm2 describe ${PM2_APP_NAME} | grep -E "port|PORT" || echo "Port info not found"`);
    logger.log('Port configuration:', 'INFO');
    logger.log(portCheck.stdout, 'INFO');

    // Get recent logs
    logger.log('📋 Getting recent logs...', 'STEP');
    const logsResult = await execCommand(conn, `pm2 logs ${PM2_APP_NAME} --lines 20 --nostream`);
    logger.log('=== Recent Logs ===', 'INFO');
    logger.log(logsResult.stdout, 'INFO');

    logger.log('✅ Deployment completed successfully!', 'SUCCESS');
    logger.log(`📝 Full log saved to: ${LOG_FILE}`, 'INFO');
    logger.log(`🌐 Application should be running on port ${PM2_PORT}`, 'SUCCESS');

  } catch (error: any) {
    logger.log(`❌ Deployment error: ${error.message}`, 'ERROR');
    if (error.stack) {
      logger.log(`Stack trace: ${error.stack}`, 'ERROR');
    }
    process.exit(1);
  } finally {
    conn.end();
    logger.close();
  }
}

// Run deployment
deploy().catch((error) => {
  logger.log(`❌ Fatal error: ${error.message}`, 'ERROR');
  process.exit(1);
});
