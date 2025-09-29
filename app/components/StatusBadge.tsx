export default function StatusBadge({ status }: { status: string }) {
  const colors: Record<string,string> = { pending:'bg-yellow-200 text-yellow-800', completed:'bg-green-200 text-green-800', shipped:'bg-blue-200 text-blue-800' };
  return <span className={`px-2 py-1 rounded text-sm font-semibold ${colors[status] || 'bg-gray-200 text-gray-800'}`}>{status}</span>;
}
