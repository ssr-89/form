<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require "PHPMailer/src/PHPMailer.php"; // подключение файла
require "PHPMailer/src/Exception.php"; // подключение файла

$mail = new PHPMailer(true); // объект с классом PHPMailer
$mail -> CharSet = "UTF-8"; // метод CharSet с обращением к кодировке UTF-8
$mail->IsHTML(true); /* Разрешаем работу с HTML */

$name = $_POST["name"]; // считываем имя
$email = $_POST["email"]; // считываем email
$phone = $_POST["phone"]; // считываем телефон
$message = $_POST["message"]; // считываем сообщение

$email_template = "template_mail.html"; // файл с шаблоном для получения сообщения с формы обратной связи

$body = file_get_contents($email_template); // формирование тела сообщения

$body = str_replace('%name%', $name, $body);
$body = str_replace('%email%', $email, $body);
$body = str_replace('%phone%', $phone, $body);
$body = str_replace('%message%', $message, $body);

$theme = "[Сообщение с сайта]"; // тема сообщения

$mail->addAddress("salavat.sadriev@gmail.com"); // адрес, куда будут приходить сообщения с сайта

$mail->Subject = $theme; // формирование темы сообщения с помощью метода Subject
$mail->MsgHTML($body); // формирование тела из данных формы

if (!$mail->send()) {
  $message = "Сообщение не отправлено";
} else {
  $message = "Сообщение успешно отправлено!";
}

$response = ["message" => $message];
header('Content-type: application/json');

echo json_encode($response);