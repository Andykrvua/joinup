import Link from 'next/link';
import SimpleBar from 'simplebar-react';
import { FormattedMessage as FM } from 'react-intl';
import { links } from 'utils/links';
import { modal } from 'utils/constants';
import { useRef, useEffect } from 'react';
import { useSetModal } from 'store/store';

const NavContent = ({ setOffsetLeft = null, setIsOpen, windowSize = null }) => {
  const elRef = useRef();
  // const setModal = useSetModal();

  useEffect(() => {
    if (setOffsetLeft !== null) {
      setOffsetLeft(() => elRef.current.offsetLeft);
    }

    return () => {
      if (setOffsetLeft !== null) {
        setOffsetLeft(0);
      }
    };
  }, [windowSize]);
  return (
    <ul className="header_nav">
      <li ref={elRef}>
        <button
          className="header_nav_link"
          id="countrylistbutton"
          aria-haspopup="true"
          aria-controls="countrylist"
          expanded="false"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <FM id="nav.country" />
          <svg xmlns="http://www.w3.org/2000/svg" width="9" height="5" fill="none">
            <path
              fill="#fff"
              d="M4.5 5a.625.625 0 0 1-.444-.181l-3.75-3.75A.628.628 0 0 1 1.194.18L4.5 3.494 7.806.188a.625.625 0 0 1 .882.88l-3.75 3.75A.625.625 0 0 1 4.5 5Z"
            />
          </svg>
        </button>
      </li>
      <li>
        <Link href={links.reviews}>
          <a className="header_nav_link">
            <FM id="nav.review" />
          </a>
        </Link>
      </li>
      <li>
        <Link href={links.blog}>
          <a className="header_nav_link">
            <FM id="nav.blog" />
          </a>
        </Link>
      </li>
      <li>
        <Link href={links.faq}>
          <a className="header_nav_link">
            <FM id="nav.faq" />
          </a>
        </Link>
      </li>
      <li>
        <Link href={links.contacts}>
          <a className="header_nav_link">
            <FM id="nav.contacts" />
          </a>
        </Link>
      </li>
      <li>
        <Link href={links.contacts}>
          <a className="header_nav_link">Агентам</a>
        </Link>
      </li>
      {/* <li>
        <button
          className="header_nav_link"
          id="countrylistbutton"
          aria-haspopup="true"
          aria-controls="countrylist"
          expanded="false"
          onClick={() => setModal({ get: modal.leadGetTours })}
        >
          <FM id="nav.pick_tour" />
        </button>
      </li> */}
    </ul>
  );
};

export default function Nav({ setOffsetLeft = null, setIsOpen, windowSize = null }) {
  return (
    <nav className="header_nav_container">
      {/* <SimpleBar style={{ maxWidth: 600, height: 35 }} autoHide={false}>
          <NavContent setIsOpen={setIsOpen} />
        </SimpleBar> */}
      <NavContent setOffsetLeft={setOffsetLeft} setIsOpen={setIsOpen} windowSize={windowSize} />
    </nav>
  );
}
