import { useEffect, useRef } from "react";
import Image from "next/image";
import { RoughNotation, RoughNotationGroup } from "react-rough-notation";
import { useTheme } from "next-themes";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

import { useSection } from "context/section";
import useOnScreen from "hooks/useOnScreen";
import useScrollActive from "hooks/useScrollActive";

import woulf from "@/assets/woulf.webp";
import AboutBgSvg from "@/components/AboutBgSvg";
import EduGroup from "@/components/EduGroup";

const AboutSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isSecOnScreen = useOnScreen(sectionRef as React.RefObject<HTMLDivElement>);

  useEffect(() => {
    const q = gsap.utils.selector(sectionRef);

    gsap.registerPlugin(ScrollTrigger);

    // profile-picture
    gsap.fromTo(
      q(".profile-picture"),
      {
        x: -200,
        opacity: 0,
      },
      {
        x: 0,
        opacity: 1,
        scrollTrigger: {
          trigger: q(".profile-picture"),
          start: "20% bottom",
        },
      }
    );

    const fromAnimation = {
      y: 100,
      opacity: 0,
    };

    const toAnimation = (triggerTarget: string) => ({
      y: 0,
      opacity: 1,
      scrollTrigger: {
        trigger: q(`.${triggerTarget}`),
        start: "top bottom",
      },
    });

    // about-intro
    gsap.fromTo(q(".about-intro"), fromAnimation, toAnimation("about-intro"));

    // edu-bg
    gsap.fromTo(q(".edu-bg"), fromAnimation, toAnimation("edu-bg"));

    // bg svg parallax effect
    gsap.fromTo(
      q(".bg-svg"),
      { y: -80 },
      {
        scrollTrigger: {
          trigger: q(".bg-svg"),
          scrub: true,
        },
        y: 65,
        duration: 3,
      }
    );

    // image bg svg parallax effect
    gsap.fromTo(
      q(".img-svg"),
      { y: -30 },
      {
        scrollTrigger: {
          trigger: q(".img-svg"),
          start: "80% 75%",
          scrub: true,
        },
        y: 30,
      }
    );
  }, []);

  const { theme } = useTheme();

  const eduRef = useRef<HTMLDivElement>(null);

  // Set active link for about section
  const aboutSection = useScrollActive(sectionRef as React.RefObject<HTMLDivElement>);
  const { onSectionChange } = useSection();
  useEffect(() => {
    aboutSection ? onSectionChange!("who am i?") : onSectionChange!("");
  }, [aboutSection, onSectionChange]);

  return (
    <div
      ref={sectionRef}
      className="about-panel bg-white dark:bg-[#1B2731] relative "
    >
      <section id="whoami" className="section">
        <RoughNotationGroup>
          <div className="text-center">
            <RoughNotation
              type="underline"
              color={`${
                theme === "light" ? "rgb(0, 122, 122)" : "rgb(5 206 145)"
              }`}
              strokeWidth={2}
              order={1}
              show={isSecOnScreen}
            >
              <h2 className="section-heading">Qui suis-je ?</h2>
            </RoughNotation>
          </div>
          <div className="md:grid grid-rows-5 lg:grid-rows-5 grid-cols-5">
            <div className="col-start-1 col-end-3 row-start-1 row-end-4 lg:col-start-1 lg:col-end-3 flex justify-center items-center py-4 lg:mb-[20%]">
              <div className="relative w-72">
                <svg
                  width="96"
                  height="21"
                  viewBox="0 0 96 21"
                  aria-hidden="true"
                  className="img-svg hidden lg:block fill-marrsgreen dark:fill-carrigreen absolute -top-14 -left-14"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M79.2202 0.959991L62.7802 17.32L46.3301 0.959991L29.8902 17.32L13.4501 0.959991L0.410156 13.94L0.400146 17.58L13.4501 4.58999L29.8902 20.95L46.3301 4.58999L62.7802 20.95L79.2202 4.58999L93.7302 19.02L95.5402 17.19L79.2202 0.959991Z" />
                </svg>

                <div className="profile-picture overflow-hidden md:overflow-visible rounded-md md:shadow-2xl">
                  <Image
                    src={woulf}
                    width={1700}
                    height={1790}
                    priority
                    alt="Photo de profil de Corentin Boucard"
                    className="rounded-md"
                  />
                </div>

                <svg
                  width="15"
                  height="14"
                  viewBox="0 0 15 14"
                  aria-hidden="true"
                  className="img-svg hidden lg:block fill-marrsgreen dark:fill-carrigreen absolute bottom-8 -right-12"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M13.68 11.51L9.23 7.05998L13.68 2.61C14.24 2.05 14.24 1.12999 13.68 0.569994C13.12 0.00999391 12.2 0.00999391 11.64 0.569994L7.19002 5.02001L2.74001 0.569994C2.18001 0.00999391 1.26003 0.00999391 0.700029 0.569994C0.140029 1.12999 0.140029 2.05 0.700029 2.61L5.15004 7.05998L0.700029 11.51C0.140029 12.07 0.140029 12.99 0.700029 13.55C1.26003 14.11 2.18001 14.11 2.74001 13.55L7.19002 9.09999L11.64 13.55C12.2 14.11 13.12 14.11 13.68 13.55C14.24 12.99 14.24 12.08 13.68 11.51Z" />
                </svg>

                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="img-svg hidden lg:block fill-[#FF9D00] absolute -bottom-10 right-6 scale-150"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M11.6799 5.68002C11.6799 8.65002 9.27994 11.05 6.30994 11.05C3.33994 11.05 0.939941 8.65002 0.939941 5.68002C0.939941 2.71002 3.33994 0.309998 6.30994 0.309998C9.27994 0.309998 11.6799 2.71002 11.6799 5.68002Z" />
                </svg>
              </div>
            </div>

            <p className="col-start-1 col-end-3 row-start-4 row-end-6 lg:row-start-1 lg:row-end-2 lg:col-start-3 lg:col-end-6 lg:ml-8 lg:mt-auto about-intro">
              Avec un diplôme d’ingénieur et 3 ans d’expérience en alternance,
              j’ai développé des compétences polyvalentes en backend et en
              DevOps. En plus du développement, j’ai automatisé le cycle de vie
              des applications avec des pipelines CI/CD, images Docker, et
              scripts. J’ai travaillé sur des projets variés, ce qui m’a appris
              à m’adapter rapidement et à résoudre des problèmes efficacement.
              Cette expérience me permet d’être opérationnel rapidement,
              notamment dans un contexte agile.
            </p>

            <div
              className="col-start-3 col-end-6 row-start-1 row-end-6 lg:row-start-2 lg:row-end-5 md:ml-8 place-content-end"
              ref={eduRef}
            >
              <p className="edu-bg my-4">Voici mon parcours pro.</p>
              {workExperience.map((edu) => (
                <EduGroup edu={edu} key={edu.id} />
              ))}
            </div>
          </div>
        </RoughNotationGroup>
      </section>

      <AboutBgSvg />
    </div>
  );
};

const workExperience = [
  {
    id: 1,
    title: "Développeur Backend / DevOps",
    subTitle: "Crédit Mutuel Arkéa | 2022 - 2024",
    description:
      "Intégré à une équipe transverse en méthodologie agile, j'ai travaillé sur des migrations et de l'automatisation DevOps.",
    list: [
      "Migration d’une application Java GWT vers un backend Spring Boot (gestion projet + dev).",
      "Mise en place de pipelines CI/CD et conteneurisation Docker pour les tests applicatifs.",
      "Refonte du front-end d’une application métier (GWT → Vue.js).",
      "Automatisation de tests via un convertisseur Stoplight → Postman.",
      "Déploiement et supervision applicative (Docker, GitLab CI, sondes, monitoring).",
    ],
  },
  {
    id: 2,
    title: "Développeur Backend",
    subTitle: "Ergoss Logiciels | 2021 - 2022",
    description:
      "Développement d'une API monolithique en C# dans un environnement structuré.",
    list: [
      "Conception et maintenance d'une API en C# exposée aux clients.",
      "Collaboration avec les équipes via Git, Azure DevOps et Jira.",
    ],
  },
  {
    id: 3,
    title: "Network, Development & Security",
    subTitle: "GIE 246 | 2021",
    description:
      "Travail sur la sécurisation et la gestion des accès au sein de l'entreprise.",
    list: [
      "Mise en place d’un bastion d’authentification.",
      "Étude et implémentation de solutions de gestion de mots de passe.",
      "Développement d’un script de rotation des mots de passe pour les switchs réseau.",
      "Migration d’outils internes vers une solution cloud.",
    ],
  },
];

export default AboutSection;
