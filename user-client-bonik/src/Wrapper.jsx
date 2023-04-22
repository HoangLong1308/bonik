import Header from './common/header/Header';
import Footer from './common/footer/Footer';
const Wrapper = ({ children, Cart }) => {
    return (
        <>
            <Header />
            {children}
            <Footer />
        </>
    );
};

export default Wrapper;
