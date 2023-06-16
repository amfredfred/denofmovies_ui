export interface IQueryResponse {
    fileUniqueId?: string
    fileId?: number
    fileType?: string
    fileSize?: number
    fileUploader?: string
    fileDownloadCount?: number
    fileParentPath?: string
    fileDescription?: string
    fileThumbnail?: string
    fileCreatedAt?: Date | string
    fileRemoteId?: string
    fileDownloadLink?: string
    fileCaption?: string
    fileIsLoading: boolean
    fileSkip?(method: 'next' | 'previous' | 'shuffle', id?: number): void
}



export interface IFileSliderSection {
    children?: React.ReactNode,
    items?: IQueryResponse[]
    headline: React.ReactNode
    fileIsLoading: boolean
    fileSkip?(method: 'next' | 'previous' | 'shuffle'): void
}

export interface IApp {
    actions?: 'search' | 'focusedFile' | 'query' | 'filter' | 'type' | 'id' | 'loading'
    search: {
        actions: 'query' | 'filter'
        query: string
        filter: string[]
    },

    focusedFile?: {
        actions?: 'type' | 'id' | 'loading'
        type?: string,
        id?: string
        loading?: boolean
    },

    user?: {
        id: number,
        first_name: string,
        last_name: string,
        username: string,
        language_code: string,
        authenticated: boolean
        platform: string
    }

}

export const App: IApp = {
    search: {
        actions: 'query',
        query: 'random movies',
        filter: []
    },
}