"use client";

import { useTranslations } from "next-intl";

export default function ClientExample() {
    const t = useTranslations("common");

    return (
        <div className="p-4 border rounded shadow mt-4">
            <h2 className="text-xl font-bold mb-2">Client Component Example</h2>
            <div className="flex gap-2">
                <button className="px-4 py-2 border rounded">{t("back")}</button>
                <button className="px-4 py-2 bg-green-500 text-white rounded">
                    {t("next")}
                </button>
            </div>
        </div>
    );
}
