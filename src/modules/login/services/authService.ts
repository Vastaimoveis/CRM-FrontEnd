interface RegisterPayload {
    name: string;
    phone: string;
    email: string;
    password: string;
}

export async function registerUser(data: RegisterPayload) {

    return true;
}