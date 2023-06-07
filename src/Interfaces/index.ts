export interface IQueryResponse {
    fileId?: string
    fileType?: string
    fileContent?: string
    fileSize?: string
    fileUploader?: string
    fileUploadedFrom?: string,
    fileDownloadCount?: string
    fileRelativePath?: string
    filePlaceHolder?: string
    fileOriginalSize?: string
    fileParentPath?: string
    fileIsLoading: boolean
}

export interface IApp {
    actions?: 'search' | 'focusedFile' | 'query' | 'filter' | 'type' | 'id'

    search: {
        actions: 'query' | 'filter'
        query: string
        filter: string[]
    },

    focusedFile?: {
        actions?: 'type' | 'id'
        type?: string,
        id?: string
    },

    user?: {
        id: number,
        first_name: string,
        last_name: string,
        username: string,
        language_code: string,
        authenticated: boolean
        platform:string
    }

}

export const App: IApp = {
    search: {
        actions: 'query',
        query: 'random movies',
        filter: []
    },
}