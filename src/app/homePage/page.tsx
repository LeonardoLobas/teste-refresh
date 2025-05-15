"use client";
import React, { useCallback, useState } from "react";
import { activityGet, IActivityGet } from "@/request/activityGet";

import { useRouter } from "next/navigation";

const Page = () => {
    const [activities, setActivities] = useState<IActivityGet[]>([]);
    const navigate = useRouter();
    const handleClick = useCallback(async () => {
        try {
            const response = await activityGet();

            console.log("response", response);
            setActivities(response as IActivityGet[]);
        } catch (error: unknown) {
            console.log(error);
            if (error instanceof Error && error.message === "REFRESH_ERROR") {
                navigate.push("/loginPage");
            }

            throw error;
        }
    }, []);

    return (
        <div className="w-full h-screen flex flex-col justify-center items-center">
            <h1 className="text-xl mb-4">Você tem acesso</h1>
            <button
                onClick={handleClick}
                className="mb-6 px-4 cursor-pointer py-2 bg-blue-500 text-white rounded"
            >
                Buscar
            </button>

            <div className="space-y-2">
                {activities.map((activity) => (
                    <div key={activity.id} className="text-center">
                        <p>Nome: {activity.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Page;
