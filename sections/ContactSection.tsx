import { useEffect, useRef } from "react";
import { RoughNotation } from "react-rough-notation";
import { useTheme } from "next-themes";

import LinkButton from "@/components/LinkButton";
import { useSection } from "context/section";
import useOnScreen from "hooks/useOnScreen";
import useScrollActive from "hooks/useScrollActive";

const ContactSection: React.FC = () => {
  const { theme } = useTheme();

  const sectionRef = useRef<HTMLDivElement>(null);
  const isSecOnScreen = useOnScreen(sectionRef as React.RefObject<HTMLDivElement>);

  const elementRef = useRef<HTMLDivElement>(null);
  const isOnScreen = useOnScreen(elementRef as React.RefObject<HTMLDivElement>);

  // Set active link for contact section
  const contactSection = useScrollActive(sectionRef as React.RefObject<HTMLDivElement>);
  const { onSectionChange } = useSection();
  useEffect(() => {
    contactSection && onSectionChange!("contact");
  }, [contactSection]);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="section min-h-[700px] text-center"
    >
      <div className="text-center">
        <RoughNotation
          type="underline"
          color={`${theme === "light" ? "rgb(0, 122, 122)" : "rgb(5 206 145)"}`}
          strokeWidth={2}
          order={1}
          show={isOnScreen}
        >
          <h2 className="text-2xl inline-block my-6 font-medium">Contact</h2>
        </RoughNotation>
      </div>
      <div className="mt-8 mb-20">
        <h3 className="font-medium text-lg mb-2 md:text-3xl" ref={elementRef}>
          Construisons quelque chose de génial ensemble !
        </h3>
        <p className="mb-6 mx-auto max-w-lg md:mb-10 lg:leading-loose">
          En tant que développeur, je suis motivé par ma passion du code et ma
          soif de nouveaux défis. Si vous avez une opportunité de collaboration
          ou une idée à concrétiser, n’hésitez pas à me contacter !
        </p>
        <LinkButton href={`mailto:${process.env.NEXT_PUBLIC_EMAIL}`}>
          Me contacter
        </LinkButton>
      </div>
    </section>
  );
};

export default ContactSection;
