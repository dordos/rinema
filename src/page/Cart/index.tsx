import React, { useEffect, useState } from 'react';
import MenuBar from '../../components/ui/MenuBar';
import './style.scss';
import axios from 'axios';
import { BsStar, BsStarHalf, BsStarFill } from 'react-icons/bs';
import { AiOutlinePlusCircle, AiOutlineMinusCircle, AiOutlineClose } from 'react-icons/ai';

import { FaEquals, FaPlus } from 'react-icons/fa';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, currentUser, database } from '../../api/firebase';
import { get, ref, set } from 'firebase/database';
import { movieDetailType } from '../../types/movieType';

const Cart = () => {
  const [cartData, setCartData] = useState<movieDetailType[] | undefined>();
  const [cartCheckList, setCartCheckList] = useState<movieDetailType[]>([]);
  const [cartPrice, setCartPrice] = useState([]);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      const cartData = ref(database, `admins/${user.uid}`);
      get(cartData).then((snapshot) => {
        if (snapshot.exists()) {
          const data = Object.values<movieDetailType>(snapshot.val());
          const getCartData = data.filter((el) => el.userMovieState.cartState === true);
          setCartData(getCartData);
        }
      });
    }
  });

  const [starAverage, setStarAverage] = useState([
    <BsStar size='20' color='#888888' />,
    <BsStar size='20' color='#888888' />,
    <BsStar size='20' color='#888888' />,
    <BsStar size='20' color='#888888' />,
    <BsStar size='20' color='#888888' />,
  ]);

  const star = (average: number) => {
    const [first, second] = ((average / 10) * 5).toFixed(1).split('.');
    const averageCopy = [...starAverage];

    for (let i = 0; i < Number(first); i++) {
      averageCopy[i] = <BsStarFill size='20' color='#e22232' />;
    }
    if (Number(second) >= 5) {
      averageCopy[Number(first)] = <BsStarHalf size='20' color='#e22232' />;
    }
    setStarAverage(averageCopy);
  };

  const cartSelect = (checked: boolean, id: any) => {
    if (checked) {
      setCartCheckList((prev) => [...prev, id]);
    } else {
      setCartCheckList(cartCheckList.filter((el) => el !== id));
    }
  };

  const removeCart = (movieId: number) => {
    const [removeTarget]: any = cartData?.filter((el) => el.id === movieId);
    set(ref(database, `admins/${currentUser}/${movieId}`), {
      ...removeTarget,
      userMovieState: {
        ...removeTarget?.userMovieState,
        cartState: false,
      },
    });
  };

  useEffect(() => {}, [cartData]);

  return (
    <>
      <MenuBar />
      <div className='cartWrap'>
        <ul className='cart'>
          {cartData?.map((cartItem, idx) => (
            <li className='cartItemList' key={idx}>
              <div className='orderCheck'>
                <input
                  type='checkbox'
                  className='cartCheckBox'
                  name={`cartItemCheck${idx}`}
                  onChange={(e) => {
                    cartSelect(e.target.checked, cartItem.id);
                  }}
                />
                <label htmlFor='cartCheckBox'></label>
              </div>
              <div className='cartItem__img'>
                <img src={`https://image.tmdb.org/t/p/w500/${cartItem?.poster_path}`} alt='' />
              </div>

              <div className='cartInfo'>
                <h1>{cartItem?.title}</h1>
                <div className='cartAverage'>
                  <div className='averageImg'>{starAverage}</div>
                  <div className='avaerageNum'>{cartItem?.vote_average}</div>
                </div>
                <div className='cartInfo__metaData'>
                  <div className='moviedDte'>{cartItem?.release_date}</div>
                  <div className='movieTime'>•{cartItem?.runtime}분</div>
                </div>
                <p className='genres'>
                  장르 :
                  {cartItem?.genres.map((item, idx) => (
                    <span key={idx}>{item.name}</span>
                  ))}
                </p>
                <p className='language'>
                  지원 언어 :
                  {cartItem?.spoken_languages.map((language, idx) => (
                    <span key={idx}>{language.iso_639_1}</span>
                  ))}
                </p>
              </div>

              <div className='rentalTime'>
                <h2>대여시간</h2>
                <div className='addRentalTime'>
                  <AiOutlineMinusCircle />
                  <p>23일</p>
                  <AiOutlinePlusCircle />
                </div>
                <div className='retalDate'>
                  <p>
                    <span>시작일 : </span>2022.02.12
                  </p>
                  <p>
                    <span>종료일 : </span> 2022.02.13
                  </p>
                </div>
              </div>

              <div className='rentalPrice'>
                <h2>대여 금액</h2>
                <div>
                  <p>1,000</p>
                  <span>원</span>
                </div>
              </div>
              <div
                className='listClose'
                onClick={(e) => {
                  removeCart(cartItem.id);
                }}
              >
                <AiOutlineClose />
              </div>
            </li>
          ))}

          {/* payment */}
          <div className='totalPrice'>
            <div>
              <div className='selectAllMovieWrap'>
                <h2>총 선택 영화</h2>
                <div>
                  <p>2</p>
                  <span>편</span>
                </div>
              </div>
              <div>
                <FaPlus />
              </div>
              <div className='selectAllTimeWrap'>
                <h2>총 대여 시간</h2>
                <div>
                  <p>292</p>
                  <span>일</span>
                </div>
              </div>
              <div>
                <FaEquals />
              </div>
              <div className='selectAllPriceWrap'>
                <h2>총 결제 금액</h2>
                <div>
                  <p>24,000</p>
                  <span>원</span>
                </div>
              </div>
              <div>
                <button>결제하기</button>
              </div>
            </div>
          </div>
        </ul>
      </div>
    </>
  );
};

export default Cart;
