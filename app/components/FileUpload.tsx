export default function FileUpload({ onChange }: { onChange: (f?: File) => void }) {
  return (
    <input
      type="file"
      onChange={(e) => {
        const file = e.target.files?.[0];
        onChange(file);
      }}
    />
  );
}
