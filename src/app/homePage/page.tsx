"use client";
import React, { useCallback, useState } from "react";
import { activityGet, IActivityGet } from "@/request/activityGet";

const Page = () => {
    const [activities, setActivities] = useState<IActivityGet[]>([]);

    const handleClick = useCallback(async () => {
        const response = await activityGet();
        setActivities(response);
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
