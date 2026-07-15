export default async function CustomerDetailPage({
    params,
  }: {
    params: Promise<{ id: string }>;
  }) {
    const { id } = await params;
    return (
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Customer #{id}</h1>
        <p className="mt-2 text-sm text-gray-500">
          Debt history, log payment, and WhatsApp reminder will go here.
        </p>
      </div>
    );
  }