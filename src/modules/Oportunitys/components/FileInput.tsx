interface Props {
  label: string;
}

export default function FileInput({ label }: Props) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">
        {label}
      </label>

      <input
        type="file"
        accept="image/*,application/pdf"
        className="w-full border rounded p-2"
      />
    </div>
  );
}