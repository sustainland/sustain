
export function getControllersMethods(obj: { [x: string]: any; }) {
    let props: any[] = []

    do {
        const l = Object.getOwnPropertyNames(obj)
            .concat(Object.getOwnPropertySymbols(obj).map(s => s.toString()))
            .sort()
            .filter((p, i, arr) =>
                typeof obj[p] === 'function' &&
                p !== 'constructor' &&
                (i == 0 || p !== arr[i - 1]) &&
                props.indexOf(p) === -1
            )
        props = props.concat(l)
    }
    while (
        (obj = Object.getPrototypeOf(obj)) &&
        Object.getPrototypeOf(obj)
    )
    return props
}