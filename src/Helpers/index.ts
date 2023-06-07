import dayjs from "dayjs"
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

export const wait = /*@devfred*/ async (seconds?: number) => new Promise((resolved) => setTimeout(() => resolved('continue'), Number(seconds) * 1000 || 1000))

// fromart numbers in k`s
export const numInKs = (val: number | string): string => Intl.NumberFormat("en", { notation: "compact" }).format(Number(val))

export const timeTo = (from: string | number | Date) => dayjs(Date.now()).to(from)//(userDatas as any)?.[7] * 1000