import Image from "next/image";
import { useEffect, useRef } from "react";
import { RoughNotation } from "react-rough-notation";
import { useTheme } from "next-themes";

import ProjectCard from "@/components/ProjectCard";
import { useSection } from "context/section";
import useOnScreen from "hooks/useOnScreen";
import useScrollActive from "hooks/useScrollActive";

import forkfolioImage from "public/projects/forkfolio.webp";

const ProjectSection: React.FC = () => {
  const { theme } = useTheme();

  const sectionRef = useRef<HTMLDivElement>(null);

  const elementRef = useRef<HTMLDivElement>(null);
  const isOnScreen = useOnScreen(elementRef as React.RefObject<HTMLDivElement>);

  // Set active link for project section
  const projectSection = useScrollActive(sectionRef as React.RefObject<HTMLDivElement>);
  const { onSectionChange } = useSection();
  useEffect(() => {
    projectSection && onSectionChange!("projects");
  }, [onSectionChange, projectSection]);

  return (
    <section ref={sectionRef} id="projects" className="section">
      <div className="project-title text-center">
        <RoughNotation
          type="underline"
          color={`${theme === "light" ? "rgb(0, 122, 122)" : "rgb(5 206 145)"}`}
          strokeWidth={1}
          order={1}
          show={isOnScreen}
        >
          <h2 className="section-heading">Projets</h2>
        </RoughNotation>
      </div>
      <span className="project-desc text-center block mb-4" ref={elementRef}>
        J’ai bossé sur pas mal de projets, et voici ceux qui méritent qu’on en
        parle.
      </span>
      <div className="flex flex-wrap">
        {projects.map((project, index) => (
          <ProjectCard key={project.title} index={index} project={project} />
        ))}
      </div>
      {/* <div className="others text-center mb-16">
        Other projects can be explored in{" "}
        <a
          href="https://github.com/satnaing"
          className="font-medium underline link-outline text-marrsgreen dark:text-carrigreen whitespace-nowrap"
        >
          my github profile
        </a>
      </div> */}
    </section>
  );
};

const projects = [
  {
    title: "Forkfolio",
    type: "DevOps & Backend",
    image: (
      <Image
        src={forkfolioImage}
        sizes="100vw"
        fill
        alt="Forkfolio"
        className="transition-transform duration-500 hover:scale-110 object-cover"
      />
    ),
    desc: "Portfolio auto-hébergé avec déploiement automatisé. Déployé sur MicroK8s avec CI/CD via GitHub Actions.",
    tags: ["Next.js", "MicroK8s", "GitHub Actions", "CI/CD", "DevOps"],
    liveUrl: "http://woulf.fr",
    codeUrl: "https://github.com/Wooulf/forkfolio",
    bgColor: "bg-[#0F172A]",
    githubApi: "https://api.github.com/repos/ton-user/forkfolio",
  },
];

export default ProjectSection;
