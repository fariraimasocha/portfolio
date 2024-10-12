import { JSX, PropsWithChildren } from 'react'
import { highlight } from 'sugar-high'
import { MDXRemote, MDXRemoteProps } from 'next-mdx-remote/rsc'

import Counter from './counter'

type CodeProps = PropsWithChildren<JSX.IntrinsicElements['code']>

function Code({ children, ...props }: CodeProps) {
    const codeHTML = highlight(children as string)
    return <code dangerouslySetInnerHTML={{ __html: codeHTML }} {...props} />
}

const components = {
    code: Code,
    Counter
}

export default function MDXContent(
    props: JSX.IntrinsicAttributes & MDXRemoteProps
) {
    return (
        <MDXRemote
            {...props}
            components={{ ...components, ...(props.components || {}) }}
        />
    )
}
