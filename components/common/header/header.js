import Logo from './logo';
import UserArea from './userArea';
import BurgerBtn from './burgerBtn';
import Nav from './nav';
import { location } from 'utils/constants';
import { useState, useEffect } from 'react';
import getViewport from 'utils/getViewport';
import SubnavCountry from './subnavCountry';
import { useSetCountryModal, useGetCountryModal } from 'store/store';

export default function Header({ navData }) {
  // country submenu offset left
  const [offsetLeft, setOffsetLeft] = useState(null);
  const setCountryModal = useSetCountryModal();
  const getCountryModal = useGetCountryModal();

  // country submenu variant
  // const [isShow, setIsShow] = useState(true);

  // country submenu is open
  const windowSize = getViewport();

  // useEffect(() => {
  //   if (!window.matchMedia('(min-width: 900px)').matches) {
  //     setIsShow(true);
  //   } else {
  //     setIsShow(false);
  //   }
  //   return () => {
  //     setIsShow(true);
  //   };
  // }, [windowSize]);
  return (
    <header className="header">
      <div className="container header_container">
        <Logo />
        <Nav setOffsetLeft={setOffsetLeft} setIsOpen={setCountryModal} windowSize={windowSize} />
        <UserArea />
        <BurgerBtn />
      </div>

      <SubnavCountry
        offsetLeft={offsetLeft}
        isOpen={getCountryModal}
        setIsOpen={setCountryModal}
        navData={navData}
        windowSize={windowSize}
      />
    </header>
  );
}
