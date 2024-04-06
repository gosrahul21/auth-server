const HTML_TEMPLATE = (message: string, showCTA: boolean) => {
  return `
    <!DOCTYPE html>

<html lang="en" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">

<head>
	<title></title>
	<meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
	<meta content="width=device-width, initial-scale=1.0" name="viewport" />
    <meta name="color-scheme" content="light">
    <meta name="supported-color-schemes" content="light">
	<style>
		* {
			box-sizing: border-box;
		}

		body {
			margin: 0;
			padding: 0;
		}

		a[x-apple-data-detectors] {
			color: inherit !important;
			text-decoration: inherit !important;
		}

		#MessageViewBody a {
			color: inherit;
			text-decoration: none;
		}

		p {
			line-height: inherit
		}

		.desktop_hide,
		.desktop_hide table {
			mso-hide: all;
			display: none;
			max-height: 0px;
			overflow: hidden;
		}

		.image_block img+div {
			display: none;
		}

		.menu_block.desktop_hide .menu-links span {
			mso-hide: all;
		}

		@media (max-width:700px) {

			.desktop_hide table.icons-inner,
			.row-3 .column-1 .block-3.button_block .alignment a,
			.row-3 .column-1 .block-3.button_block .alignment div,
			.social_block.desktop_hide .social-table {
				display: inline-block !important;
			}

			.icons-inner {
				text-align: center;
			}

			.icons-inner td {
				margin: 0 auto;
			}

			.image_block div.fullWidth {
				max-width: 100% !important;
			}

			.mobile_hide {
				display: none;
			}

			.row-content {
				width: 100% !important;
			}

			.stack .column {
				width: 100%;
				display: block;
			}

			.mobile_hide {
				min-height: 0;
				max-height: 0;
				max-width: 0;
				overflow: hidden;
				font-size: 0px;
			}

			.desktop_hide,
			.desktop_hide table {
				display: table !important;
				max-height: none !important;
			}

			.row-1 .column-1 .block-1.paragraph_block td.pad>div {
				text-align: center !important;
				font-size: 18px !important;
			}

			.row-3 .column-1 .block-2.paragraph_block td.pad>div {
				text-align: left !important;
				font-size: 14px !important;
			}

			.row-3 .column-1 .block-1.heading_block h1,
			.row-3 .column-1 .block-3.button_block .alignment {
				text-align: left !important;
			}

			.row-3 .column-1 .block-1.heading_block h1 {
				font-size: 20px !important;
			}

			.row-4 .column-1 .block-1.icons_block .alignment,
			.row-6 .column-1 .block-2.menu_block .alignment {
				text-align: center !important;
			}

			.row-4 .column-1 .block-1.icons_block td.pad {
				padding: 10px 24px !important;
			}

			.row-3 .column-1 .block-4.paragraph_block td.pad>div {
				text-align: justify !important;
				font-size: 10px !important;
			}

			.row-4 .column-2 .block-1.paragraph_block td.pad>div {
				text-align: left !important;
				font-size: 16px !important;
			}

			.row-3 .column-1 .block-3.button_block a,
			.row-3 .column-1 .block-3.button_block div,
			.row-3 .column-1 .block-3.button_block span {
				font-size: 14px !important;
				line-height: 28px !important;
			}

			.row-6 .column-1 .block-2.menu_block td.pad {
				padding: 8px !important;
			}

			.row-6 .column-1 .block-2.menu_block .menu-links a,
			.row-6 .column-1 .block-2.menu_block .menu-links span {
				font-size: 14px !important;
			}

			.row-6 .column-1 .block-1.paragraph_block td.pad {
				padding: 0 0 16px !important;
			}

			.row-3 .column-1 {
				padding: 0 24px 48px !important;
			}

			.row-4 .column-1 {
				padding: 16px 16px 8px !important;
			}

			.row-4 .column-2 {
				padding: 0 24px 16px !important;
			}

			.row-6 .column-1 {
				padding: 32px 16px 48px !important;
			}
		}
	</style>
</head>

<body style="background-color: #f8f6ff; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
	<table border="0" cellpadding="0" cellspacing="0" class="nl-container" role="presentation"
		style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f8f6ff; background-image: none; background-position: top left; background-size: auto; background-repeat: no-repeat;"
		width="100%">

		<tbody>
			<tr>
				<td>
					<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-1"
						role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
						<tbody>
							<tr>
								<td>
									<table align="center" border="0" cellpadding="0" cellspacing="0"
										class="row-content stack" role="presentation"
										style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #4dba6c; color: #000000; width: 680px; margin: 0 auto;"
										width="680">
										<tbody>
											<tr>
												<td class="column column-1"
													style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 32px; padding-left: 48px; padding-right: 48px; padding-top: 32px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"
													width="100%">
													<table border="0" cellpadding="0" cellspacing="0"
														class="paragraph_block block-1" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;"
														width="100%">
														<tr>
															<td class="pad">
																<div
																	style="color:#ffffff;direction:ltr;font-family:Helvetica Neue, Helvetica, Arial, sans-serif;font-size:24px;font-weight:700;letter-spacing:0px;line-height:120%;text-align:left;mso-line-height-alt:28.799999999999997px;">
																	<p style="margin: 0;">Kigentech</p>
																</div>
															</td>
														</tr>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>

					<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-2"
						role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
						<tbody>
							<tr>
								<td>
									<table align="center" border="0" cellpadding="0" cellspacing="0"
										class="row-content stack" role="presentation"
										style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #4dba6c; border-radius: 0; color: #000000; width: 680px; margin: 0 auto;"
										width="680">
										<tbody>
											<tr>
												<td class="column column-1"
													style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"
													width="100%">
													<table border="0" cellpadding="0" cellspacing="0"
														class="image_block block-1" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
														width="100%">
														<tr>
															<td class="pad"
																style="width:100%;padding-right:0px;padding-left:0px;">
																<div align="center" class="alignment"
																	style="line-height:10px">
																	<div class="fullWidth" style="max-width: 640px;">
																		<img alt="An open email illustration"
																			src="http://35.84.119.231:3050/uploads/images/Email-Illustration.png"
																			style="display: block; height: auto; border: 0; width: 100%;"
																			title="An open email illustration"
																			width="640" />
																	</div>
																</div>
															</td>
														</tr>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>

					<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-3"
						role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
						<tbody>
							<tr>
								<td>
									<table align="center" border="0" cellpadding="0" cellspacing="0"
										class="row-content stack" role="presentation"
										style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; data-ogsb="rgb(255, 255, 255)" border-radius: 0; color: #000000; width: 680px; margin: 0 auto;"
										width="680">
										<tbody>
											<tr>
												<td class="column column-1"
													style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 48px; padding-left: 48px; padding-right: 48px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"
													width="100%">
													<table border="0" cellpadding="0" cellspacing="0"
														class="heading_block block-1" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
														width="100%">
														<tr>
															<td class="pad"
																style="padding-top:12px;text-align:center;width:100%;">
																<h1
																	style="margin: 0; color: #292929; direction: ltr; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 32px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: center; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 38.4px;">
																	<span class="tinyMce-placeholder">Account status
																		update!</span>
																</h1>
															</td>
														</tr>
													</table>
													<table border="0" cellpadding="0" cellspacing="0"
														class="paragraph_block block-2" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;"
														width="100%">
														<tr>
															<td class="pad"
																style="padding-bottom:0px;padding-top:10px;">
																<div
																	style="color:#101112;direction:ltr;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:left;mso-line-height-alt:19.2px;">
																	<p style="margin: 0; margin-bottom: 16px;">${message}
																	</p>
																</div>
															</td>
														</tr>
													</table>
													${
                            showCTA
                              ? `<table border="0" cellpadding="0" cellspacing="0"
														class="button_block block-3" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
														width="100%">
														<tr>
															<td class="pad" style="padding-top:24px;text-align:left;">
																<div align="center" class="alignment">
																	<![endif]--><a href="http://35.84.119.231:5173/login" style="text-decoration:none;display:inline-block;color:#ffffff;background-color:#7259ff;border-radius:8px;width:auto;border-top:0px solid transparent;font-weight:400;border-right:0px solid transparent;border-bottom:0px solid transparent;border-left:0px solid transparent;padding-top:8px;padding-bottom:8px;font-family:Helvetica Neue, Helvetica, Arial, sans-serif;font-size:16px;text-align:center;mso-border-alt:none;word-break:keep-all;"
																		target="_blank"><span
																			style="padding-left:16px;padding-right:16px;font-size:16px;display:inline-block;letter-spacing:normal;"><span
																				style="word-break: break-word; line-height: 32px;">Login
																				to
																				Kigentech</span></span></a>
																</div>
															</td>
														</tr>
													</table>
													<table border="0" cellpadding="0" cellspacing="0"
														class="paragraph_block block-4" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;"
														width="100%">
														<tr>
															<td class="pad" style="padding-top:16px;">
																<div
																	style="color:#666666;direction:ltr;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:12px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:center;mso-line-height-alt:14.399999999999999px;">
																	<p style="margin: 0;">Never disclose your account username and password to anyone</p>
																</div>
															</td>
														</tr>
													</table>`
                              : `<div></div>`
                          }
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>

					<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-4"
						role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
						<tbody>
							<tr>
								<td>
									<table align="center" border="0" cellpadding="0" cellspacing="0"
										class="row-content stack" role="presentation"
										style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ebfff0; border-bottom: 0 solid #FFFFFF; border-left: 20px solid #FFFFFF; border-radius: 0; border-right: 20px solid #FFFFFF; border-top: 0 solid #FFFFFF; color: #000000; width: 680px; margin: 0 auto;"
										width="680">
										<tbody>
											<tr>
												<td class="column column-1"
													style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 24px; padding-left: 8px; padding-right: 8px; padding-top: 24px; vertical-align: middle; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"
													width="16.666666666666668%">
													<table border="0" cellpadding="0" cellspacing="0"
														class="icons_block block-1" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
														width="100%">
														<tr>
															<td class="pad"
																style="vertical-align: middle; color: #000000; font-family: inherit; font-size: 14px; font-weight: 400; text-align: center;">
																<table align="center" cellpadding="0" cellspacing="0"
																	class="alignment" role="presentation"
																	style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
																	<tr>
																		<td
																			style="vertical-align: middle; text-align: center; padding-top: 0px; padding-bottom: 0px; padding-left: 0px; padding-right: 0px;">
																			<img align="center" class="icon" height="32"
																				src="http://35.84.119.231:3050/uploads/images/info_Icon.png"
																				style="display: block; height: auto; margin: 0 auto; border: 0;"
																				width="34" /></td>
																	</tr>
																</table>
															</td>
														</tr>
													</table>
												</td>
												<td class="column column-2"
													style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-right: 48px; padding-top: 5px; vertical-align: middle; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"
													width="83.33333333333333%">
													<table border="0" cellpadding="0" cellspacing="0"
														class="paragraph_block block-1" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;"
														width="100%">
														<tr>
															<td class="pad">
																<div
																	style="color:#5c4ac1;direction:ltr;font-family:Helvetica Neue, Helvetica, Arial, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:150%;text-align:left;mso-line-height-alt:24px; padding: 10px 0px 10px 0px;">
																	<p style="margin: 0;">Get in touch with us to Request a Demo or for any other inquiries
																		<br /><strong><a href="mailto:info@kigentech.com"
																				rel="noopener"
																				style="text-decoration: underline; color: #3e2d9c;"
																				target="_blank">Request demo</a></strong></p>
																</div>
															</td>
														</tr>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>

					<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-5"
						role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
						<tbody>
							<tr>
								<td>
									<table align="center" border="0" cellpadding="0" cellspacing="0"
										class="row-content stack" role="presentation"
										style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; border-radius: 0; color: #000000; width: 680px; margin: 0 auto;"
										width="680">
										<tbody>
											<tr>
												<td class="column column-1"
													style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"
													width="100%">
													<div class="spacer_block block-1"
														style="height:56px;line-height:56px;font-size:1px;"> </div>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>

					<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-6"
						role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
						<tbody>
							<tr>
								<td>
									<table align="center" border="0" cellpadding="0" cellspacing="0"
										class="row-content stack" role="presentation"
										style="background-color: #4dba6c; border-radius: 0; color: #000000; width: 680px; margin: 0 auto;"
										width="680">
										<tbody>
											<tr>
												<td class="column column-1"
													style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 30px; padding-top: 32px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"
													width="100%">
													<table border="0" cellpadding="0" cellspacing="0"
														class="paragraph_block block-1" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;"
														width="100%">
														<tr>
															<td class="pad" style="padding-bottom:32px;">
																<div
																	style="color:#ffffff;direction:ltr;font-family:Helvetica Neue, Helvetica, Arial, sans-serif;font-size:24px;font-weight:700;letter-spacing:0px;line-height:120%;text-align:center;mso-line-height-alt:28.799999999999997px;">
																	<p style="margin: 0;">Kigentech</p>
																</div>
															</td>
														</tr>
													</table>
													<table border="0" cellpadding="8" cellspacing="0"
														class="menu_block block-2" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
														width="100%">
														<tr>
															<td class="pad">
																<table border="0" cellpadding="0" cellspacing="0"
																	role="presentation"
																	style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
																	width="100%">
																	<tr>
																		<td class="alignment"
																			style="text-align:center;font-size:0px;">
																			<div class="menu-links">
																				<a
																					href="https://www.kigentech.com/news-and-events"
																					style="mso-hide:false;padding-top:0px;padding-bottom:0px;padding-left:16px;padding-right:16px;display:inline-block;color:#5740d8;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:16px;text-decoration:none;letter-spacing:1px;"
																					target="_self">News</a>
																					<span
																					class="sep"
																					style="font-size:16px;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;color:#5740d8;">|</span><a
																					href="https://www.kigentech.com/about-us"
																					style="mso-hide:false;padding-top:0px;padding-bottom:0px;padding-left:16px;padding-right:16px;display:inline-block;color:#5740d8;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:16px;text-decoration:none;letter-spacing:1px;"
																					target="_self">About
																					us</a><span
																					class="sep"
																					style="font-size:16px;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;color:#5740d8;">|</span>
																					<a
																					href="https://www.kigentech.com/solutions"
																					style="mso-hide:false;padding-top:0px;padding-bottom:0px;padding-left:16px;padding-right:16px;display:inline-block;color:#5740d8;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:16px;text-decoration:none;letter-spacing:1px;"
																					target="_self">Solutions</a><span
																					class="sep"
																					style="font-size:16px;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;color:#5740d8;">|</span><a
																					href="https://www.kigentech.com/contact-us"
																					style="mso-hide:false;padding-top:0px;padding-bottom:0px;padding-left:16px;padding-right:16px;display:inline-block;color:#5740d8;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:16px;text-decoration:none;letter-spacing:1px;"
																					target="_self">Contact
																					us</a>
																			</div>
																		</td>
																	</tr>
																</table>
															</td>
														</tr>
													</table>
													<table border="0" cellpadding="0" cellspacing="0"
														class="social_block block-3" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
														width="100%">
														<tr>
															<td class="pad"
																style="padding-bottom:5px;padding-top:24px;text-align:center;padding-right:0px;padding-left:0px;">
																<div align="center" class="alignment">
																	<table border="0" cellpadding="0" cellspacing="0"
																		class="social-table" role="presentation"
																		style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block;"
																		width="184px">
																		<tr>
																			<td style="padding:0 7px 0 7px;"><a
																					href="https://www.facebook.com/"
																					target="_blank"><img alt="Facebook"
																						height="32"
																						src="http://35.84.119.231:3050/uploads/images/facebook2x.png"
																						style="display: block; height: auto; border: 0;"
																						title="facebook"
																						width="32" /></a></td>
																			<td style="padding:0 7px 0 7px;"><a
																					href="https://www.twitter.com/"
																					target="_blank"><img alt="Twitter"
																						height="32"
																						src="http://35.84.119.231:3050/uploads/images/twitter2x.png"
																						style="display: block; height: auto; border: 0;"
																						title="twitter"
																						width="32" /></a></td>
																			<td style="padding:0 7px 0 7px;"><a
																					href="https://www.linkedin.com/"
																					target="_blank"><img alt="Linkedin"
																						height="32"
																						src="http://35.84.119.231:3050/uploads/images/linkedin2x.png"
																						style="display: block; height: auto; border: 0;"
																						title="linkedin"
																						width="32" /></a></td>
																			<td style="padding:0 7px 0 7px;"><a
																					href="https://www.instagram.com/"
																					target="_blank"><img alt="Instagram"
																						height="32"
																						src="http://35.84.119.231:3050/uploads/images/instagram2x.png"
																						style="display: block; height: auto; border: 0;"
																						title="instagram"
																						width="32" /></a></td>
																		</tr>
																	</table>
																</div>
															</td>
														</tr>
													</table>
													<table border="0" cellpadding="10" cellspacing="0"
														class="divider_block block-4" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
														width="100%">
														<tr>
															<td class="pad">
																<div align="center" class="alignment">
																	<table border="0" cellpadding="0" cellspacing="0"
																		role="presentation"
																		style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
																		width="85%">
																		<tr>
																			<td class="divider_inner"
																				style="font-size: 1px; line-height: 1px; border-top: 1px solid #9583FF;">
																				<span> </span></td>
																		</tr>
																	</table>
																</div>
															</td>
														</tr>
													</table>
													<table border="0" cellpadding="0" cellspacing="0"
														class="paragraph_block block-5" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;"
														width="100%">
														<tr style="margin: 0%; padding: 0%;">
															<td class="pad" style="padding-top:5px;">
																<div
																	style="color:#443888;direction:ltr;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:12px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:center;mso-line-height-alt:14.399999999999999px;">
																	<p style="margin: 0;">You have received this email
																		because you have registered at <a
																			href="http://35.84.119.231:5173" rel="noopener"
																			style="text-decoration: underline; color: #3e2d9c;"
																			target="_blank">this site</a></p>
																</div>
															</td>
														</tr>
													</table>
													<table border="0" cellpadding="0" cellspacing="0"
														class="paragraph_block block-6" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;margin: 0%; padding: 0%;"
														width="100%">
														<tr>
															<td class="pad" style="padding-top:5px;">
																<div
																	style="color:#443888;direction:ltr;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:12px;font-weight:400;letter-spacing:0px;line-height:100%;text-align:center;mso-line-height-alt:14.40;">
																	<p style="margin: 0;">if you feel you received it by
																		mistake or wish to unsubscribe, <a
																			href="http://35.84.119.231:5173/unsubcribe"
																			rel="noopener"
																			style="text-decoration: underline; color: #3e2d9c;"
																			target="_blank">click here</a>.</p>
																</div>
															</td>
														</tr>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
				</td>
			</tr>
		</tbody>
	</table><!-- End -->
</body>

</html>
    `;
};

export default HTML_TEMPLATE;
