import { Button } from '@/components/ui/button'



export default function Intro() {
    return (
        <section className='flex flex-col-reverse items-start gap-x-10 gap-y-4 pb-8 md:flex-row md:items-center'>
            <div className='mt-2 flex-1 md:mt-0'>
                <h1 className='title no-underline'>Hey, I&#39;m Farirai.</h1>
                <p className='mt-3 font-light text-muted-foreground'>
                    I&#39;m a software engineer based in Harare, Zimbabwe. I&#39;m
                    passionate about learning new technologies and sharing knowledge with
                    others.
                </p>
                <Button
                    asChild
                    className='mt-5 disabled:opacity-50'
                >
                    <a href='/resume/FariraiMasocha.pdf' target='_blank'>Download CV</a>
                </Button>
            </div>
        </section>
    )
}
