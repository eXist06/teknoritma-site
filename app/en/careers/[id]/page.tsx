import JobDetailPage from "@/components/JobDetailPage";

export default function JobDetailRouteEN({ params }: { params: { id: string } }) {
  return <JobDetailPage jobId={params.id} />;
}

