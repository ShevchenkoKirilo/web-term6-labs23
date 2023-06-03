export interface Image {
    id: number;
    imageBase64: string;
    userLikedIds: number[];
    userId: number;
    userIsBanned: boolean;
}