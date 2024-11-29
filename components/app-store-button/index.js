import Link from 'next/link'
import Image from 'next/image'
import svg from './Download_on_the_App_Store_Badge_US-UK_RGB_blk_092917.svg'

const AppStoreButton = ({appId}) => (
    <Link href={`https://apps.apple.com/${appId}`} target="_blank">
        <Image src={svg} alt="download on App Store" unoptimized />
    </Link>
)

export default AppStoreButton