import JobDetailPage from "@/components/JobDetailPage";

export default function JobDetailRoute({ params }: { params: { id: string } }) {
  return <JobDetailPage jobId={params.id} />;
}

