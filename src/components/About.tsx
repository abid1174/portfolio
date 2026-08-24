import Reveal from './Reveal';

type Props = {
  paragraphs: string[];
  skills: string[];
};

export default function About({ paragraphs, skills }: Props) {
  return (
    <section className="section" id="about">
      <div className="wrap about">
        <Reveal className="about__label">
          <p className="eyebrow">About</p>
        </Reveal>

        <div className="about__body">
          {paragraphs.map((text, i) => (
            <Reveal key={i} delay={i * 100}>
              <p className="about__p">{text}</p>
            </Reveal>
          ))}

          <Reveal delay={paragraphs.length * 100}>
            <ul className="skills">
              {skills.map((skill) => (
                <li className="tag" key={skill}>
                  {skill}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
