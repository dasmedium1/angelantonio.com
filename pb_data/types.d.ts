/// <reference types="pocketbase" />

declare namespace PocketBase {
    interface Record {
        id: string;
        created: string;
        updated: string;
        collectionId: string;
        collectionName: string;
    }

    interface TimelineEvent extends Record {
        title: string;
        year: number;
        description: string;
        image: string;
        isLeft: boolean;
    }
}
