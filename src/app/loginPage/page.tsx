"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postLoginForm } from "@/request/loginPost";

const createLoginFormSchema = z.object({
    user: z.string().min(1, "user é obrigatorio"),
    password: z.string().min(1, "Senha é obrigatorio"),
    signIn: z.boolean().optional(),
});

export type createLoginFormData = z.infer<typeof createLoginFormSchema>;

export default function Home() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<createLoginFormData>({
        resolver: zodResolver(createLoginFormSchema),
    });

    async function handleLogin(data: createLoginFormData) {
        console.log("entrou no kevin");
        const response = await postLoginForm(data);
        console.log(response);
    }

    return (
        <div className="grid  items-center justify-items-center bg-green-700 min-h-screen  ">
            <form
                onSubmit={handleSubmit(handleLogin, console.log)}
                className="grid"
            >
                <label htmlFor="user">user</label>
                <input
                    {...register("user")}
                    className="bg-amber-50 border-2 border-amber-300"
                />
                {errors.user && <span>{errors.user.message}</span>}
                <label htmlFor="senha">Senha</label>
                <input
                    {...register("password")}
                    className="bg-amber-50 border-2 border-amber-300"
                />
                {errors.password && <span>{errors.password.message}</span>}

                <button type="submit" className="w-28 h-2 bg-amber-50">
                    Submit
                </button>
            </form>
        </div>
    );
}
