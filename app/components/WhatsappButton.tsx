export default function WhatsAppButton({ message }: { message: string }) {
  const handleClick = () => alert(`WhatsApp message placeholder: ${message}`);
  return <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleClick}>Send WhatsApp</button>;
}
