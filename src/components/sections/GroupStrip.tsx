import Image from 'next/image';
import { IMAGES } from '@/lib/images';

export default function GroupStrip() {
  return (
    <section className="group-strip" id="about">
      <div className="wrap">
        <div className="eyebrow-sm reveal">Hyphen Group of Companies &amp; Partners</div>
        <div className="group-logos reveal">
          <Image src={IMAGES.logoHyphenConnect} alt="Hyphen Connect logo" width={130} height={52} style={{height:'52px', width:'130px', objectFit:'contain', objectPosition:'center'}}/>
          <Image src={IMAGES.logoHyphenLabs} alt="Hyphen Labs logo" width={130} height={52} style={{height:'52px', width:'130px', objectFit:'contain', objectPosition:'center'}}/>
          <Image src={IMAGES.logoHyphenONE} alt="Hyphen ONE logo" width={130} height={52} style={{height:'52px', width:'130px', objectFit:'contain', objectPosition:'center'}}/>
          <Image src={IMAGES.logoMercuryCareers} alt="Mercury Careers logo" width={130} height={52} style={{height:'52px', width:'130px', objectFit:'contain', objectPosition:'center'}}/>
          <Image src={IMAGES.logoHyphenExchange} alt="Hyphen Exchange logo" width={130} height={52} style={{height:'52px', width:'130px', objectFit:'contain', objectPosition:'center'}}/>
          <Image src={IMAGES.logoSocialHouse} alt="The Social House logo" width={130} height={52} style={{height:'52px', width:'130px', objectFit:'contain', objectPosition:'center'}}/>
          <span>Hyphen Consultancy</span>
        </div>
      </div>
    </section>
  );
}
