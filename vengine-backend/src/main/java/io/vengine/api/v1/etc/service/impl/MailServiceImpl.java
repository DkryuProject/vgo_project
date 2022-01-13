package io.vengine.api.v1.etc.service.impl;

import io.vengine.api.common.utils.GenerateCertCharacter;
import io.vengine.api.v1.etc.service.MailService;
import io.vengine.api.v1.user.entity.TempCompany;
import io.vengine.api.v1.user.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import javax.mail.Message;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;

@Service
public class MailServiceImpl implements MailService {
    private final String toDayTime;

    @Autowired
    private JavaMailSender emailSender;

    @Value("${admin.mail}")
    private String adminMail;

    @Value("${api.url}")
    private String url;

    public static final String ePw =  createKey();

    public MailServiceImpl() {
        SimpleDateFormat format = new SimpleDateFormat ( "yyyy-MM-dd HH:mm:ss");
        Date time = new Date();
        this.toDayTime = format.format(time);
    }

    @Override
    public void verifyEmail(String toEmail) throws Exception {
        MimeMessage message = createVerifyMessage(toEmail);
        try{
            emailSender.send(message);
        }catch(MailException es){
            es.printStackTrace();
            throw new IllegalArgumentException();
        }
    }

    @Override
    public String getVerifyCode() {
        return ePw;
    }

    @Override
    public void interfaceErrorMail(String email) throws Exception {
        MimeMessage message = createInterfaceErrorMessage(email);
        try{
            emailSender.send(message);
        }catch(MailException es){
            es.printStackTrace();
            throw new IllegalArgumentException();
        }
    }

    @Override
    public void sendMail(String email, String title, String contents) throws Exception{
        MimeMessage message = createSimpleMessage(email, title, contents);
        try{
            emailSender.send(message);
        }catch(MailException es){
            es.printStackTrace();
            throw new IllegalArgumentException();
        }
    }

    @Override
    public void signUpRequest(TempCompany tempCompany) throws Exception {
        MimeMessage message = createSignUpRequestMessage(tempCompany);
        try{
            emailSender.send(message);
        }catch(MailException es){
            es.printStackTrace();
            throw new IllegalArgumentException();
        }
    }

    @Override
    public void userConfirm(String email, String password, String type) throws Exception {
        MimeMessage message = createConfirmMessage(email, password, type);
        try{
            emailSender.send(message);
        }catch(MailException es){
            es.printStackTrace();
            throw new IllegalArgumentException();
        }
    }

    private MimeMessage createConfirmMessage(String email, String password, String type) throws Exception {
        MimeMessage message = emailSender.createMimeMessage();
        message.addHeader("Content-type", "text/HTML; charset=UTF-8");
        message.addHeader("Access-Control-Allow-Origin", "*");

        message.addRecipients(Message.RecipientType.TO, email);//보내는 대상

        String title="";
        if("confirm".equals(type)){
            title = "승인 처리 완료";
        }else if("invite".equals(type)){
            title = "You have been invited and approved by the Vgo system";
        }else if("reset".equals(type)){
            title = "Password 초기화";
        }
        message.setSubject(title);//제목

        String msgg = "";
        if("invite".equals(type)){
            msgg += "<div style='margin:100px;'>";
            msgg += "<div style='border:1px solid black; font-family:verdana';>";
            msgg += "<h3>Go to the Vgo App system and log in with your email address and temporary password. After logging in, " +
                    "you can edit your name, phone number and password through personal settings.</h3>";
            msgg += "<div style='font-size:100%'>";
            msgg += "Temporary password : <strong>"+password+"</strong>";
            msgg += "<div>";
            msgg += "<div style='font-size:100%'>";
            msgg += "Welcome to the Vgo world.";
            msgg += "<div>";
            msgg += "</div>";
        }else{
            msgg += "<div style='margin:100px;'>";
            msgg += "<div align='center' style='border:1px solid black; font-family:verdana';>";
            msgg += "<h3 style='color:blue;'>로그인 하셔서 비밀번호 변경 부탁드립니다.</h3>";
            msgg += "<div style='font-size:130%'>";
            msgg += "임시 비밀번호 : <strong>"+password+"</strong>";
            msgg += "<div><br/> ";
            msgg += "</div>";
        }

        message.setText(msgg, "utf-8", "html");//내용
        message.setFrom(new InternetAddress("system@v-go.io", "V-go"));//보내는 사람

        return message;
    }

    private MimeMessage createSignUpRequestMessage(TempCompany tempCompany) throws Exception {
        MimeMessage message = emailSender.createMimeMessage();
        message.addHeader("Content-type", "text/HTML; charset=UTF-8");
        message.addHeader("Access-Control-Allow-Origin", "*");

        //관리자들에게 메일 발송
        String[] adminMailList = adminMail.split(",");
        InternetAddress[] mailTo = new InternetAddress [adminMailList.length] ;
        for(int i=0; i<adminMailList.length; i++){
            mailTo[i] = new InternetAddress(adminMailList[i]);
        }
        message.addRecipients(Message.RecipientType.TO, mailTo);//보내는 대상
        message.setSubject("["+tempCompany.getName()+"] 회사 등록 요청 드립니다.");//제목

        String msgg = "";
        msgg += "<div style='margin:100px;'>";
        msgg += "<div align='center' style='justify-content:center; align-items:center; border:1px solid black; font-family:verdana';>";
        msgg += "<h3 style='color:blue;'>가입 정보</h3>";
        msgg += "<div style='font-size:100%'>";
        msgg += "회사명 : <strong>"+tempCompany.getName()+"</strong>";
        msgg += "<div><br/> ";
        msgg += "<div style='font-size:100%'>";
        msgg += "요청 일자: <strong>"+this.toDayTime+"</strong>";
        msgg += "<div><br/> ";
  /*
        msgg += "<div style='font-size:100%'>";
        msgg += "<a href='#' onClick='javascript:document.mailForm.submit();'><strong>승인</strong></a>";
        msgg += "<div><br/> ";
        msgg += "<form name='mailForm' action='"+url+"/v1/sign/confirm' method='POST'>" +
                "<input type='hidden' name='email' value="+user.getEmail()+" />" +
                "</form>";
 */
        msgg += "</div>";
        message.setText(msgg, "utf-8", "html");//내용
        message.setFrom(new InternetAddress("system@v-go.io", "V-go"));//보내는 사람

        return message;
    }

    private MimeMessage createVerifyMessage(String to) throws Exception {
        System.out.println("보내는 대상 : " + to);
        //System.out.println("인증 번호 : " + ePw);
        MimeMessage message = emailSender.createMimeMessage();
        message.addHeader("Content-type", "text/HTML; charset=UTF-8");
        message.addHeader("Access-Control-Allow-Origin", "*");

        message.addRecipients(Message.RecipientType.TO, to);//보내는 대상
        message.setSubject("Vengine 인증번호가 도착했습니다.");//제목

        String msgg = "";
        msgg += "<div style='margin:100px;'>";
        msgg += "<h1> 안녕하세요  Vengine입니다!!! </h1>";
        msgg += "<br>";
        msgg += "<p>아래 코드를 회원가입 창으로 돌아가 입력해주세요<p>";
        msgg += "<br>";
        msgg += "<p>감사합니다!<p>";
        msgg += "<br>";
        msgg += "<div align='center' style='border:1px solid black; font-family:verdana';>";
        msgg += "<h3 style='color:blue;'>회원가입 코드입니다.</h3>";
        msgg += "<div style='font-size:130%'>";
        msgg += "CODE : <strong>";
        msgg += ePw + "</strong><div><br/> ";
        msgg += "</div>";
        message.setText(msgg, "utf-8", "html");//내용
        message.setFrom(new InternetAddress("system@v-go.io", "V-go"));//보내는 사람

        return message;
    }

    private MimeMessage createInterfaceErrorMessage(String to) throws Exception {
        System.out.println("보내는 대상 : " + to);
        MimeMessage message = emailSender.createMimeMessage();
        message.addHeader("Content-type", "text/HTML; charset=UTF-8");
        message.addHeader("Access-Control-Allow-Origin", "*");
        message.addRecipients(Message.RecipientType.TO, to);//보내는 대상
        message.setSubject("Vengine Interface Error 알림 메일이 도착했습니다.");//제목

        String msgg = "";
        msgg += "<div style='margin:100px;'>";
        msgg += "<br>";
        msgg += "<p>Interface 오류 메일<p>";
        msgg += "<br>";
        msgg += "<p>감사합니다!<p>";
        msgg += "</div>";
        message.setText(msgg, "utf-8", "html");//내용
        message.setFrom(new InternetAddress("system@v-go.io", "V-go"));//보내는 사람

        return message;
    }

    private MimeMessage createSimpleMessage(String email, String title, String contents) throws Exception {
        System.out.println("보내는 대상 : " + email);
        MimeMessage message = emailSender.createMimeMessage();

        message.addHeader("Content-type", "text/HTML; charset=UTF-8");
        message.addHeader("Access-Control-Allow-Origin", "*");
        message.addRecipients(Message.RecipientType.TO, email);//보내는 대상
        message.setSubject(title);//제목

        String msgg = "";
        msgg += "<div style='margin:100px;'>";
        msgg += "<p>"+contents+"<p>";
        msgg += "</div>";
        message.setText(msgg, "utf-8", "html");//내용
        message.setFrom(new InternetAddress("system@v-go.io", "V-go"));//보내는 사람

        return message;
    }

    //인증코드 만들기
    public static String createKey() {
        GenerateCertCharacter generateCertCharacter = new GenerateCertCharacter();
        return generateCertCharacter.verifyCodeGenerate();
    }
}
