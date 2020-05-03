export function parseQueryString(query: string): any {
    const vars = query.split('&');
    return vars.reduce((accum, v) => {
        const pair = v.split('=');
        const key = decodeURIComponent(pair[0]);
        const value = decodeURIComponent(pair[1]);
        return {
            ...accum,
            [key]: value,
        }
    }, {});
}
