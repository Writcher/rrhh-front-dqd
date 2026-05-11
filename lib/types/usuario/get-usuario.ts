export type UsuarioItemDto = {
    id: number;
    nombre: string;
    email: string;
    id_tipousuario: number;
    id_proyecto: number;
    tipousuario: string;
    estadousuario: string;
};

export type UsuariosResponseDto = {
    usuarios: UsuarioItemDto[];
    totalUsuarios: number;
};