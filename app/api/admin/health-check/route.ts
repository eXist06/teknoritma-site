import { NextRequest, NextResponse } from "next/server";
import { verifySarusHubRole } from "@/lib/utils/role-verification";
import { getDatabase } from "@/lib/db/schema";
import { existsSync, mkdirSync } from "fs";
import path from "path";

export async function GET(request: NextRequest) {
  try {
    // Check authorization (admin or sarus-hub role)
    const authCheck = await verifySarusHubRole(request);
    if (!authCheck.isAuthorized) {
      return NextResponse.json(
        { error: "Unauthorized. Requires admin or sarus-hub role." },
        { status: 403 }
      );
    }

    const checks: {
      name: string;
      status: "ok" | "error";
      message: string;
      details?: any;
    }[] = [];

    // 1. SQL Database Connection Check
    try {
      const db = getDatabase();
      const result = db.prepare("SELECT 1 as test").get();
      db.close();
      
      if (result && (result as any).test === 1) {
        checks.push({
          name: "SQL Veritabanı Bağlantısı",
          status: "ok",
          message: "SQL veritabanı bağlantısı başarılı",
        });
      } else {
        checks.push({
          name: "SQL Veritabanı Bağlantısı",
          status: "error",
          message: "SQL veritabanı sorgusu başarısız",
        });
      }
    } catch (error: any) {
      checks.push({
        name: "SQL Veritabanı Bağlantısı",
        status: "error",
        message: `SQL bağlantı hatası: ${error.message}`,
        details: error.message,
      });
    }

    // 2. Database Table Check
    try {
      const db = getDatabase();
      const tableExists = db
        .prepare(
          "SELECT name FROM sqlite_master WHERE type='table' AND name='sarus_hub_items'"
        )
        .get();
      db.close();

      if (tableExists) {
        checks.push({
          name: "Veritabanı Tablosu",
          status: "ok",
          message: "sarus_hub_items tablosu mevcut",
        });
      } else {
        checks.push({
          name: "Veritabanı Tablosu",
          status: "error",
          message: "sarus_hub_items tablosu bulunamadı",
        });
      }
    } catch (error: any) {
      checks.push({
        name: "Veritabanı Tablosu",
        status: "error",
        message: `Tablo kontrolü hatası: ${error.message}`,
        details: error.message,
      });
    }

    // 3. Database Query Test
    try {
      const db = getDatabase();
      const count = db.prepare("SELECT COUNT(*) as count FROM sarus_hub_items").get() as { count: number };
      db.close();

      checks.push({
        name: "Veritabanı Sorgusu",
        status: "ok",
        message: `Toplam ${count.count} kayıt bulundu`,
        details: { recordCount: count.count },
      });
    } catch (error: any) {
      checks.push({
        name: "Veritabanı Sorgusu",
        status: "error",
        message: `Sorgu hatası: ${error.message}`,
        details: error.message,
      });
    }

    // 4. Uploads Directory Check
    try {
      const uploadsDir = path.join(process.cwd(), "public", "uploads", "sarus-hub");
      const exists = existsSync(uploadsDir);
      
      if (exists) {
        checks.push({
          name: "Uploads Klasörü",
          status: "ok",
          message: "Uploads klasörü mevcut",
          details: { path: uploadsDir },
        });
      } else {
        // Try to create it
        try {
          mkdirSync(uploadsDir, { recursive: true });
          checks.push({
            name: "Uploads Klasörü",
            status: "ok",
            message: "Uploads klasörü oluşturuldu",
            details: { path: uploadsDir },
          });
        } catch (createError: any) {
          checks.push({
            name: "Uploads Klasörü",
            status: "error",
            message: `Klasör oluşturulamadı: ${createError.message}`,
            details: { path: uploadsDir, error: createError.message },
          });
        }
      }
    } catch (error: any) {
      checks.push({
        name: "Uploads Klasörü",
        status: "error",
        message: `Klasör kontrolü hatası: ${error.message}`,
        details: error.message,
      });
    }

    // 5. Videos Directory Check
    try {
      const videosDir = path.join(process.cwd(), "public", "uploads", "sarus-hub", "videos");
      const exists = existsSync(videosDir);
      
      if (exists) {
        checks.push({
          name: "Videos Klasörü",
          status: "ok",
          message: "Videos klasörü mevcut",
        });
      } else {
        try {
          mkdirSync(videosDir, { recursive: true });
          checks.push({
            name: "Videos Klasörü",
            status: "ok",
            message: "Videos klasörü oluşturuldu",
          });
        } catch (createError: any) {
          checks.push({
            name: "Videos Klasörü",
            status: "error",
            message: `Klasör oluşturulamadı: ${createError.message}`,
          });
        }
      }
    } catch (error: any) {
      checks.push({
        name: "Videos Klasörü",
        status: "error",
        message: `Klasör kontrolü hatası: ${error.message}`,
      });
    }

    // Calculate overall status
    const allOk = checks.every((check) => check.status === "ok");
    const overallStatus = allOk ? "ok" : "error";

    return NextResponse.json({
      status: overallStatus,
      timestamp: new Date().toISOString(),
      checks,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "error",
        message: "Health check failed",
        error: error.message,
      },
      { status: 500 }
    );
  }
}


