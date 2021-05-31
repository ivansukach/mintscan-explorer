/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useMemo} from "react";
import "./font-awesome.css";
import "./Footer.css";

// const cx = classNames.bind(styles);

export default function(props) {
	const render = (
		<footer id='footer'>
			<div className='cnt clr'>
				<div className='col2'>
					<div className='footer-logo'>
						<span className='fa fa-globe' />
						МЫ В СОЦСЕТЯХ
					</div>

					<div className='footer-soc oh'>
						<a className='soc' href='https://vk.com/octa_coin'>
							<i className='fa fa-vk' />
						</a>
						<a className='soc' href='https://t.me/octa_coin'>
							<i className='fa fa-telegram' />
						</a>
						<a className='soc' href='https://www.facebook.com/octa.coin.98'>
							<i className='fa fa-facebook' />
						</a>
						<a className='soc' href='https://www.instagram.com/octa_coin/'>
							<i className='fa fa-instagram' />
						</a>
					</div>
				</div>
				<div className='col2'>
					<div className='oh'>
						<div className='footer-block'>
							<div className='footer-block-title'>Клиентам</div>
							<ul>
								<li>
									<a href='/'>
										<i className='fa fa-file-o'></i>ГЛАВНАЯ
									</a>
								</li>
								<li>
									<a href='https://octa-coin.com/novosti'>
										<i className='fa fa-file-o'></i>НОВОСТИ
									</a>
								</li>
								<li>
									<a href='/index.php?do=feedback'>
										<i className='fa fa-file-o'></i>ОБРАТНАЯ СВЯЗЬ
									</a>
								</li>
								<li>
									<a href='#'>
										<i className='fa fa-file-o'></i>БЕЛАЯ КНИГА(СКОРО!)
									</a>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>

			<div className='copyrights'>
				<div className='cnt'>
					© Copyright &copy; 2020. <a href='/'>Octa-Coin.com</a> - All Rights Reserved.
				</div>
			</div>
		</footer>
	);
	return useMemo(() => render, [render]);
}
