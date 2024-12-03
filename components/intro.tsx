import Image from 'next/image'
import authorImage from '@/public/images/authors/farirai.jpeg'
import { Button } from '@/components/ui/button'



export default function Intro() {
    return (
        <section className='flex flex-col-reverse items-start gap-x-10 gap-y-4 pb-24 md:flex-row md:items-center'>
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
            <div className='relative'>
                <Image
                    className='flex-1 rounded-lg grayscale'
                    src={authorImage}
                    alt='Farirai Masocha'
                    width={175}
                    height={175}
                    priority
                />
            </div>
        </section>
    )
}
