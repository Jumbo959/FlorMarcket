import Link from "next/link";

export default function NotFound() {
  return (
    <div className="pt-32 pb-16 min-h-screen flex items-center justify-center text-center px-4">
      <div>
        <p className="text-8xl mb-4">🌿</p>
        <h1 className="font-display text-3xl font-bold text-forest-800 mb-2">Страница не найдена</h1>
        <p className="text-forest-500 mb-6">Возможно, это растение уже продано</p>
        <Link href="/" className="px-6 py-3 bg-forest-500 text-white rounded-xl hover:bg-forest-600 transition-colors">
          На главную
        </Link>
      </div>
    </div>
  );
}
