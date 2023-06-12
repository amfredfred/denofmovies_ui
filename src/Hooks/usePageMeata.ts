import { useEffect, useLayoutEffect } from 'react'


export interface IMeataTag {
    property: "og:title" | "og:type" | "og:url" | "og:description" | "og:site_name"
    content?: any
    name?: "description" | "twitter:image:alt"
}


export interface IPageMeta {
    metas: [IMeataTag]
    title: string
}

export default function usePageMeta(props: IPageMeta, deps:any) {
    const { metas, title } = props

    useLayoutEffect(() => {
        metas.map((meta) => {
            var newMeta = document.createElement('meta');
            newMeta.httpEquiv = "X-UA-Compatible";
            newMeta.content = meta.content || '';
            newMeta.name = meta.name || '';
            (newMeta as any).property = meta.property || ''
            document.head.appendChild(newMeta);
        })

        document.title = title

    }, [deps])


}



