import dynamic from 'next/dynamic';
import MainFormBtn from './mainFormBtn';
import { svgDate } from './svg';
import Loader from 'components/common/loader';
import { formattedDate } from '../../../utils/formattedDate';

const DynamicUpWindow = dynamic(() => import(/* webpackChunkName: "Date" */ '../popups/date'), {
  ssr: false,
  loading: () => {
    return <Loader />;
  },
});

export default function DateField({ title, aria, modalIsOpen, setModalIsOpen, popupName }) {
  // не могу получить дату во внутреннем компоненте, хз
  // const tomorrow = new Date();
  // // tomorrow.setDate(tomorrow.getDate() + 1);
  // tomorrow.setDate(tomorrow.getDate() - 15);
  // const initialDate = tomorrow;
  const storeDate = title.rawDate;
  const plusDays = title.plusDays;

  title = formattedDate(title.rawDate);

  return (
    <MainFormBtn
      cName={'btn_date'}
      title={title}
      aria={aria}
      svg={svgDate}
      plusDays={plusDays}
      modalIsOpen={modalIsOpen}
      setModalIsOpen={setModalIsOpen}
    >
      <DynamicUpWindow
        setModalIsOpen={setModalIsOpen}
        modalIsOpen={modalIsOpen}
        cName={'btn_date'}
        popupName={popupName}
        storeDate={storeDate}
        initialPlusDays={plusDays}
      />
    </MainFormBtn>
  );
}
