interface RegisterPayload {
    name: string;
    phone: string;
    email: string;
    password: string;
}

export async function registerUser(data: RegisterPayload) {

    // mock temporário
    console.log({
        ...data,
        status: "pendente_aprovacao",
    });

    return true;
}