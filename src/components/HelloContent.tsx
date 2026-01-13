import prisma from "@/lib/prisma";

export default async function HelloContent() {
  const setting = await prisma.setting.findUnique({ where: { key: 'hello' } });
  const value = setting?.value ?? 'world';

  return (
    <div className="text-center">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Hello content</h2>
      <p className="text-gray-600">hello {value}</p>
    </div>
  );
}
