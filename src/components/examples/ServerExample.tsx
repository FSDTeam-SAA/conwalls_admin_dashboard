import { getTranslations } from "next-intl/server";

export default async function ServerExample() {
    const t = await getTranslations("common");

    return (
        <div className="p-4 border rounded shadow">
            <h2 className="text-xl font-bold mb-2">Server Component Example</h2>
            <p>{t("project")}: Conwalls Admin</p>
            <button className="px-4 py-2 bg-blue-500 text-white rounded">
                {t("save")}
            </button>
        </div>
    );
}
