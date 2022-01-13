package vgo.mail.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring5.SpringTemplateEngine;
import vgo.mail.dto.MaterialDto;
import vgo.mail.mapper.MaterialMapper;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.util.List;

@Service
public class MaterialService {
    @Value("${AdminMail.id}")
    private String adminMail;

    @Autowired
    MaterialMapper materialMapper;

    @Autowired
    private JavaMailSender javaMailSender;

    @Autowired
    private SpringTemplateEngine templateEngine;

    public List<MaterialDto> searchMaterialList() {
        return materialMapper.searchMaterialList();
    }

    public void mailSend(MaterialDto materialDto) throws Exception {
        try{
            MimeMessage message = javaMailSender.createMimeMessage();
            Context context = new Context();

            String title = "["+materialDto.getSupplierCompany()+"] Your items have been registered.";
            context.setVariable("user_company_name", materialDto.getRegisterCompany());
            context.setVariable("company_name", materialDto.getSupplierCompany());
            if(materialDto.getCnt()>1){
                context.setVariable("material_name", materialDto.getMaterialName()+" and "+(materialDto.getCnt()-1)+" more");
            }else{
                context.setVariable("material_name", materialDto.getMaterialName());
            }

            String mailHtml = templateEngine.process("mail/vgo_email_material", context);

            MimeMessageHelper helper = new MimeMessageHelper(message);
            helper.setSubject(title);
            String[] emailList = materialMapper.searchCompanyUsers(materialDto.getSupplierCompanyID());

            helper.setFrom(adminMail, "V-GO Team");
            helper.setTo(emailList);
            //helper.setTo("dkryu@v-go.io");
            helper.setText(mailHtml, true);

            javaMailSender.send(message);
        }catch(MailException | MessagingException es){
            es.printStackTrace();
            throw new Exception(es.getMessage());
        }
    }
}
