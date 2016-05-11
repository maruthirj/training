package java8;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.BiFunction;
import java.util.function.BinaryOperator;
import java.util.function.Predicate;
import java.util.stream.Collectors;
import java.util.stream.Stream;

class CustomerWithEmail{
	String email;
	String name;
	String emailContent;
	public CustomerWithEmail(String email, String name, String emailContent) {
		this.email = email;
		this.name = name;
		this.emailContent = emailContent;
	}
	@Override
	public String toString() {
		return "CustomerWithEmail [email=" + email + ", name=" + name + ", emailContent=" + emailContent + "]";
	}
	
	
	
}

class MailManager{
	public void sendMail(CustomerWithEmail c){
		//Mail sending code
	}
}
public class Code6 {

	private static List<CustomerWithEmail> custs = new ArrayList<>();
	
	public static void main(String[] args) throws Exception{
		
		
		MailManager mm = new MailManager();
		custs.add(new CustomerWithEmail("a@gmail.com", "Anil", "Hello There"));
		custs.add(new CustomerWithEmail("b@yahoo.com", "Brat", "Hello There again"));
		custs.add(new CustomerWithEmail("c@live.com", "Chad", "Hello today is a good day"));
		custs.add(new CustomerWithEmail("d@live.com", "Chad", "Hello today is a good day"));
		custs.add(new CustomerWithEmail("e@live.com", "Chad", "Hello today is a good day"));
		custs.add(new CustomerWithEmail("f@live.com", "Chad", "Hello today is a good day"));
	
		Stream<CustomerWithEmail> s = custs.stream().filter(cust->{
			System.out.println("Filtering ...");
			if(cust.email.contains("yahoo"))
				return false;
			return true;
		}).map(cust->{
			cust.emailContent = cust.emailContent.replaceAll("http", "");
			return cust;
		});

		
		
		
		
		
		
		
		Integer count = s.parallel().reduce(0,
				(num,cust)->{
					System.out.println(Thread.currentThread().getId()+": Reducing: "+num+" "+cust.email);
					return num+1;
				},
				(num1,num2)->{
					System.out.println(Thread.currentThread().getId()+": Combining: "+num1+" "+num2);
					return num1+num2;
				});
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		List<String> emailIds = s.parallel().reduce(new ArrayList<String>(),
				( t, u) -> {
						ArrayList<String> ret = new ArrayList<>();
						ret.addAll(t);
						ret.add(u.email);
						return ret;
				},
				( t1, t2) ->{
						ArrayList<String> ret = new ArrayList<>();
						ret.addAll(t1);
						ret.addAll(t2);
						return ret;
				});
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		//System.out.println(count);
		System.out.println(emailIds);
		
		
		Path p = Paths.get("myfile.csv");
		Stream<String> linesFromFile = Files.lines(p);
		CustomerWithEmail customer = linesFromFile.map(line->{
			CustomerWithEmail c = new CustomerWithEmail(line.split(",")[0],
												line.split(",")[1],
												line.split(",")[2]);
			return c;
		}).filter((CustomerWithEmail c)->{
			return c.email==null;
		}).findAny().orElse(null);
	
		
		
		
		
		
		
		
		
		
		
		
		Map<String, List<CustomerWithEmail>> groupedData = linesFromFile.map(line->{
			CustomerWithEmail c = new CustomerWithEmail(line.split(",")[0],
												line.split(",")[1],
												line.split(",")[2]);
			return c;
		}).collect(Collectors.groupingBy((CustomerWithEmail cust)->{
			return cust.email.split("@")[1];
		}));

		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		CustomerWithEmail cnew = new CustomerWithEmail("x@abc.com", "vinay", "Hello there");
		List<CustomerWithEmail> custs = new ArrayList<>();
		custs.add(cnew);
		
		groupedData.merge(cnew.email.split("@")[1], custs, 
				new BiFunction<List<CustomerWithEmail>, List<CustomerWithEmail>, List<CustomerWithEmail>>() {
					public java.util.List<CustomerWithEmail> apply(List<CustomerWithEmail> t, List<CustomerWithEmail> u) {
						t.addAll(u);
						return t;
					};
		});
		
		System.out.println("Grouped data: "+groupedData);
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		linesFromFile.map(line->{
			CustomerWithEmail c = new CustomerWithEmail(line.split(",")[0],
												line.split(",")[1],
												line.split(",")[2]);
			return c;
		})
		.flatMap(cust ->{
			String[] emails = cust.email.split("-");
			List<CustomerWithEmail> customers = new ArrayList<>();
			for(String email: emails){
				customers.add(new CustomerWithEmail(email, cust.name, cust.emailContent));
			}
			return customers.stream();
		})
		.distinct().forEach(System.out::println);
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
//---------------------------------------------------------------------
		linesFromFile.map(line->{
			CustomerWithEmail c = new CustomerWithEmail(line.split(",")[0],
												line.split(",")[1],
												line.split(",")[2]);
			return c;
		}).flatMap(cust ->{
			return Arrays.stream(cust.email.split("-"))
					.map(email->new CustomerWithEmail(email, cust.name, cust.emailContent));
		}).distinct().forEach(System.out::println);
//----------------------------------
		
		Predicate<CustomerWithEmail> nameAndEmailFilter = new Predicate<CustomerWithEmail>() {
			public boolean test(CustomerWithEmail t) {
				return t.email!=null && !t.email.equals("");
			}
		}.and(cust->{
			return cust.name!=null && !cust.name.equals("");
		});
				
		linesFromFile.map(line->{
			CustomerWithEmail c = new CustomerWithEmail(line.split(",")[0],
												line.split(",")[1],
												line.split(",")[2]);
			return c;
		}).filter(nameAndEmailFilter).forEach(System.out::println);

//---------------------------------
		
		Files.walk(Paths.get(".")).filter(path ->{
			return path.toString().contains(".jpg");
		}).forEach(path->{
			try {
				Files.delete(path);
			} catch (Exception e) {}
		});
	}
}
