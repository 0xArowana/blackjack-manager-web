export default async function Page({
  params,
}: {
  params: Promise<{ address: string }>;
}) {
  const tableId = (await params).address;
  return <div>My Table: {tableId}</div>;
}
