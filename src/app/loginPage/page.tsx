"use client";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { postLoginForm } from "@/request/loginPost";

const createLoginFormSchema = z.object({
    user: z.string().min(1, "user é obrigatorio"),
    password: z.string().min(1, "Senha é obrigatorio"),
    signIn: z.boolean(),
});

export type createLoginFormData = z.infer<typeof createLoginFormSchema>;

export default function Home() {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<createLoginFormData>({
        resolver: zodResolver(createLoginFormSchema),
        defaultValues: { signIn: true },
    });

    const router = useRouter();

    const handleLogin = useCallback(
        async (data: createLoginFormData) => {
            console.log("Entrou no kevin", data);
            const response = await postLoginForm(data);

            if (response instanceof Error) {
                console.error("Erro ao logar", response.message);
                return;
            }

            if (response) {
                router.push("/homePage");
                console.log("entrou");
            }
            console.log(response);
        },
        [router]
    );

    return (
        <div className="grid  items-center justify-items-center content-center bg-green-700 min-h-screen  ">
            <form onSubmit={handleSubmit(handleLogin)} className="grid">
                <label htmlFor="user">User</label>
                <Controller
                    control={control}
                    name="user"
                    render={({ field: { onChange, value } }) => (
                        <input
                            className="bg-amber-50 border-2 border-amber-300"
                            onChange={onChange}
                            value={value}
                        />
                    )}
                />
                {errors.user && <span>{errors.user.message}</span>}
                <label htmlFor="senha">Senha</label>
                <Controller
                    control={control}
                    name="password"
                    render={({ field: { onChange, value } }) => (
                        <input
                            className="bg-amber-50 border-2 border-amber-300"
                            onChange={onChange}
                            value={value}
                        />
                    )}
                />
                {errors.password && <span>{errors.password.message}</span>}

                <button type="submit" className="w-28 h-6 mt-2.5 bg-amber-50">
                    Submit
                </button>
            </form>
        </div>
    );
}
