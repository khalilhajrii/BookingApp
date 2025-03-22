import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import Image from 'react-bootstrap/Image';


const Carousels = ({ images }) => {
    return (
        <Carousel>
        <Carousel.Item>
        <Image src={process.env.PUBLIC_URL + '/img/b1.jpg'} fluid />;
          <Carousel.Caption>
            <h3>Precision Cuts, Timeless Style</h3>
            <p>Elevate Your Look Today! 💈✂️</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    );
};

export default Carousels;