export interface User {
    id: number
    email: string
    roles?: string[]
    permissions?: string[]
}


export interface DbUser {
    id: number
    email: string
    password: string;
    roles?: string[];
    permissions?: string[];
}

export interface Member {
    id: number;
    name: string;
    joiningDate: Date
}