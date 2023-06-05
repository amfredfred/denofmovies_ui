export interface IApp {
    actions?: 'search'
    search: {
        actions: 'query' | 'filter'
        query: string
        filter: string[]
    }
}

export const App: IApp = {
    search: {
        actions: 'query',
        query: 'random movies',
        filter: []
    }
}