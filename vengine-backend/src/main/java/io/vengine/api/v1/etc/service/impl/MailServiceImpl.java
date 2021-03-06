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

        message.addRecipients(Message.RecipientType.TO, email);//????????? ??????

        String title="";
        if("confirm".equals(type)){
            title = "?????? ?????? ??????";
        }else if("invite".equals(type)){
            title = "You have been invited and approved by the Vgo system";
        }else if("reset".equals(type)){
            title = "Password ?????????";
        }
        message.setSubject(title);//??????

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
            msgg += "<h3 style='color:blue;'>????????? ????????? ???????????? ?????? ??????????????????.</h3>";
            msgg += "<div style='font-size:130%'>";
            msgg += "?????? ???????????? : <strong>"+password+"</strong>";
            msgg += "<div><br/> ";
            msgg += "</div>";
        }

        message.setText(msgg, "utf-8", "html");//??????
        message.setFrom(new InternetAddress("system@v-go.io", "V-go"));//????????? ??????

        return message;
    }

    private MimeMessage createSignUpRequestMessage(TempCompany tempCompany) throws Exception {
        MimeMessage message = emailSender.createMimeMessage();
        message.addHeader("Content-type", "text/HTML; charset=UTF-8");
        message.addHeader("Access-Control-Allow-Origin", "*");

        //?????????????????? ?????? ??????
        String[] adminMailList = adminMail.split(",");
        InternetAddress[] mailTo = new InternetAddress [adminMailList.length] ;
        for(int i=0; i<adminMailList.length; i++){
            mailTo[i] = new InternetAddress(adminMailList[i]);
        }
        message.addRecipients(Message.RecipientType.TO, mailTo);//????????? ??????
        message.setSubject("["+tempCompany.getName()+"] ?????? ?????? ?????? ????????????.");//??????

        String msgg = "";
        msgg += "<div style='margin:100px;'>";
        msgg += "<div align='center' style='justify-content:center; align-items:center; border:1px solid black; font-family:verdana';>";
        msgg += "<h3 style='color:blue;'>?????? ??????</h3>";
        msgg += "<div style='font-size:100%'>";
        msgg += "????????? : <strong>"+tempCompany.getName()+"</strong>";
        msgg += "<div><br/> ";
        msgg += "<div style='font-size:100%'>";
        msgg += "?????? ??????: <strong>"+this.toDayTime+"</strong>";
        msgg += "<div><br/> ";
  /*
        msgg += "<div style='font-size:100%'>";
        msgg += "<a href='#' onClick='javascript:document.mailForm.submit();'><strong>??????</strong></a>";
        msgg += "<div><br/> ";
        msgg += "<form name='mailForm' action='"+url+"/v1/sign/confirm' method='POST'>" +
                "<input type='hidden' name='email' value="+user.getEmail()+" />" +
                "</form>";
 */
        msgg += "</div>";
        message.setText(msgg, "utf-8", "html");//??????
        message.setFrom(new InternetAddress("system@v-go.io", "V-go"));//????????? ??????

        return message;
    }

    private MimeMessage createVerifyMessage(String to) throws Exception {
        System.out.println("????????? ?????? : " + to);
        //System.out.println("?????? ?????? : " + ePw);
        MimeMessage message = emailSender.createMimeMessage();
        message.addHeader("Content-type", "text/HTML; charset=UTF-8");
        message.addHeader("Access-Control-Allow-Origin", "*");

        message.addRecipients(Message.RecipientType.TO, to);//????????? ??????
        message.setSubject("Vengine ??????????????? ??????????????????.");//??????

        String msgg = "";
        msgg += "<div style='margin:100px;'>";
        msgg += "<h1> ???????????????  Vengine?????????!!! </h1>";
        msgg += "<br>";
        msgg += "<p>?????? ????????? ???????????? ????????? ????????? ??????????????????<p>";
        msgg += "<br>";
        msgg += "<p>???????????????!<p>";
        msgg += "<br>";
        msgg += "<div align='center' style='border:1px solid black; font-family:verdana';>";
        msgg += "<h3 style='color:blue;'>???????????? ???????????????.</h3>";
        msgg += "<div style='font-size:130%'>";
        msgg += "CODE : <strong>";
        msgg += ePw + "</strong><div><br/> ";
        msgg += "</div>";
        message.setText(msgg, "utf-8", "html");//??????
        message.setFrom(new InternetAddress("system@v-go.io", "V-go"));//????????? ??????

        return message;
    }

    private MimeMessage createInterfaceErrorMessage(String to) throws Exception {
        System.out.println("????????? ?????? : " + to);
        MimeMessage message = emailSender.createMimeMessage();
        message.addHeader("Content-type", "text/HTML; charset=UTF-8");
        message.addHeader("Access-Control-Allow-Origin", "*");
        message.addRecipients(Message.RecipientType.TO, to);//????????? ??????
        message.setSubject("Vengine Interface Error ?????? ????????? ??????????????????.");//??????

        String msgg = "";
        msgg += "<div style='margin:100px;'>";
        msgg += "<br>";
        msgg += "<p>Interface ?????? ??????<p>";
        msgg += "<br>";
        msgg += "<p>???????????????!<p>";
        msgg += "</div>";
        message.setText(msgg, "utf-8", "html");//??????
        message.setFrom(new InternetAddress("system@v-go.io", "V-go"));//????????? ??????

        return message;
    }

    private MimeMessage createSimpleMessage(String email, String title, String contents) throws Exception {
        System.out.println("????????? ?????? : " + email);
        MimeMessage message = emailSender.createMimeMessage();

        message.addHeader("Content-type", "text/HTML; charset=UTF-8");
        message.addHeader("Access-Control-Allow-Origin", "*");
        message.addRecipients(Message.RecipientType.TO, email);//????????? ??????
        message.setSubject(title);//??????

        String msgg = "";
        msgg += "<div style='margin:100px;'>";
        msgg += "<p>"+contents+"<p>";
        msgg += "</div>";
        message.setText(msgg, "utf-8", "html");//??????
        message.setFrom(new InternetAddress("system@v-go.io", "V-go"));//????????? ??????

        return message;
    }

    //???????????? ?????????
    public static String createKey() {
        GenerateCertCharacter generateCertCharacter = new GenerateCertCharacter();
        return generateCertCharacter.verifyCodeGenerate();
    }
}
