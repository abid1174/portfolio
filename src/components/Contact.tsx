import Reveal from './Reveal';

type Props = {
  email: string;
  links: { label: string; href: string }[];
};

export default function Contact({ email, links }: Props) {
  return (
    <section className="section contact" id="contact">
      <div className="wrap">
        <Reveal>
          <p className="eyebrow">Contact</p>
        </Reveal>

        <Reveal delay={80}>
          <h2 className="contact__title serif">
            Have something worth
            <br />
            building? Say hello.
          </h2>
        </Reveal>

        <Reveal delay={160}>
          <a className="contact__email" href={`mailto:${email}`}>
            <span className="contact__email-text">{email}</span>
          </a>
        </Reveal>

        <Reveal delay={240}>
          <ul className="contact__links">
            {links.map((link) => (
              <li key={link.label}>
                <a href={link.href} target="_blank" rel="noreferrer noopener">
                  {link.label}
                  <span aria-hidden="true"> ↗</span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
