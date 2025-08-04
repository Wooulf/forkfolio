import { Trans } from "react-i18next";
import { useSocialLinks } from "@/components/SocialLinks"

type Props = {
  noPadding?: boolean;
};

const Footer: React.FC<Props> = ({ noPadding = false }) => {
  const socialLinks = useSocialLinks();
  return (
    <footer
      className={`${noPadding ? "pb-4" : "pb-24"} md:pb-4 text-center mt-auto`}
    >
      <div className="flex justify-center space-x-12 mb-4">
        {socialLinks.map((social) => (
          <a
            key={social.id}
            href={social.link}
            title={social.title}
            className="transform scale-150 md:scale-125 link-outline"
          >
            {social.svg}
          </a>
        ))}
      </div>
      <div>
        <Trans
          i18nKey="footer.forkedWith"
          components={{
            sr: <span className="sr-only" />,
            icon: (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mx-1 inline-block mb-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            )
          }}
        />
      </div>
    </footer>
  );
};

export default Footer;
