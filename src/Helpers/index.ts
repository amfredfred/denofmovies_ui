import dayjs from "dayjs"
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

export const wait = /*@devfred*/ async (seconds?: number) => new Promise((resolved) => setTimeout(() => resolved('continue'), Number(seconds) * 1000 || 1000))

// fromart numbers in k`s
export const numInKs = (val: number | string): string => Intl.NumberFormat("en", { notation: "compact" }).format(Number(val))

export const timeTo = (from: string | number | Date) => dayjs(Date.now()).to(from)//(userDatas as any)?.[7] * 1000

export const sub = (val: number | string, val1: number | string): number => Number(val) - Number(val1)
export const percentageOf = (perc: number | string, num: number | string): number => (Number(num) * (Number(perc)) / 100)
export const percentageFrom = (num1: number | string, num2: number | string): number => ((Number(num2) / Number(num1)))
export const difference = (val: string | number, val2: string | number): { subtract: any, percentage: any } => {
    const oldp = Number(val)
    const newp = Number(val2)
    const subtract = sub(oldp, newp);
    const addition = (oldp + newp) * 2
    const division = subtract / addition
    const percentage = (division * 100).toFixed(2)
    return { subtract, percentage }
}

export const change = (val: string | number, val2: string | number): { subtract: any, percentage: any } => {
    const oldp = Number(val)
    const newp = Number(val2)
    const subtract = sub(oldp, newp);
    const percentage = (percentageFrom(oldp, newp) * 100).toFixed()
    return { subtract, percentage }
}

export const msToTime = (duration: number) => {
    return dayjs(duration*1000).format('mm:ss')
}